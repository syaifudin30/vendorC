// mahasiswaX/db.js
const { Pool } = require('pg');

// Mengambil DATABASE_URL dari .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Opsi SSL ini penting untuk koneksi ke layanan cloud seperti Neon
  ssl: {
    rejectUnauthorized: false 
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};