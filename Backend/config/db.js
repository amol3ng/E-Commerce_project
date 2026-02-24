import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Makabelo@01',
  database: 'B2C_future_B2B_PartnersStaff',
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;