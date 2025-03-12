import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise(); // Initialize pg-promise

const db = pgp({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'altavoix',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

export default db;
