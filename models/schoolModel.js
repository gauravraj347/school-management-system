const pool = require('../config/db');

async function addSchool({ name, address, latitude, longitude }) {
  const [result] = await pool.execute(
    'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
    [name, address, latitude, longitude]
  );
  return result.insertId;
}

async function getAllSchools() {
  const [rows] = await pool.execute(
    'SELECT id, name, address, latitude, longitude, created_at FROM schools'
  );
  return rows;
}

module.exports = { addSchool, getAllSchools };
