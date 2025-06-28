const pool = require('../db');

async function createUser(firebaseUser, extraInfo = {}) {
  const { uid, email } = firebaseUser;
  const { name, bio, city, country} = extraInfo;

  // Check if user exists
  const selectResult = await pool.query(
    'SELECT * FROM users WHERE firebase_uid = $1',
    [uid]
  );

  if (selectResult.rows.length > 0) {
    const error = new Error('User already exists');
    error.statusCode = 409; // Conflict
    throw error;
  }

  // Insert new user
  const insertResult = await pool.query(
    `INSERT INTO users
      (firebase_uid, email, name, bio, city, country, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     RETURNING *`,
    [uid, email, name, bio, city, country, ]
  );

  return insertResult.rows[0];
}

async function getUser(firebaseUser) {
  const { uid } = firebaseUser;

  const selectResult = await pool.query(
    'SELECT * FROM users WHERE firebase_uid = $1',
    [uid]
  );

  if (selectResult.rows.length === 0) {
    return null;
  }

  return selectResult.rows[0];
}

module.exports = { createUser, getUser };
