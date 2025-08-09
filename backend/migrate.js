import 'dotenv/config';
const databasu_url = process.env.DATABASE_URL;

import {runner} from 'node-pg-migrate';

runner({
    databaseUrl: databasu_url,
    direction: 'up',
    dir: './backend/migrations',
    migrationsTable: 'migrations',
    count: Infinity,
    driver: 'pg',
    noLock: true,
})
.then(() => {
    console.log('Migrations completed successfully.');
    process.exit(0);
})
.catch((error) => {
    console.error('Error running migrations:', error);
    process.exit(1);
})