import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'railway_db',
  password: process.env.DB_PASSWORD || 'qwerty@123',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export default pool;