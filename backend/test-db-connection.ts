import 'dotenv/config';
import { Pool } from 'pg';

console.log('Testing database connection...');
// Mask the password in logs
const connectionString = process.env.DATABASE_URL || '';
console.log(`Connection string provided: ${connectionString.replace(/:[^:@]+@/, ':****@')}`);

if (!connectionString) {
    console.error('ERROR: DATABASE_URL is not set in .env');
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 5000, // 5s timeout
});

pool.connect()
    .then((client) => {
        console.log('✅ Success! Connected to database.');
        return client.query('SELECT NOW()')
            .then((res) => {
                console.log('Query Result:', res.rows[0]);
                client.release();
                pool.end();
            });
    })
    .catch((err) => {
        console.error('❌ Connection Failed:', err.message);
        if (err.code) console.error('Error Code:', err.code);
        console.error('Full Error:', err);
        pool.end();
    });
