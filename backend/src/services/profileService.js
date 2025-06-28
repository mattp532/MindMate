// services/profileService.js
const pool = require('../db');

exports.getProfile = async (userId) => {
  const res = await pool.query('SELECT id, email, name, bio, city, country FROM users WHERE id = $1', [userId]);
  if (res.rows.length === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return res.rows[0];
};

exports.updateProfile = async (userId, profileData) => {
  const { name, bio, city, country } = profileData;
  const res = await pool.query(
    `UPDATE users SET name = $1, bio = $2, city = $3, country = $4 WHERE id = $5 RETURNING id, email, name, bio, city, country`,
    [name, bio, city, country, userId]
  );
  return res.rows[0];
};
