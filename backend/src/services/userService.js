const pool = require('../db');

async function getOrCreateUser(firebaseUser) {
  const { uid, email } = firebaseUser;

  const selectResult = await pool.query(
    'SELECT * FROM users WHERE firebase_uid = $1',
    [uid]
  );

  if (selectResult.rows.length > 0) {
    return selectResult.rows[0]; 
  }

  // User not found, create new user
  const insertResult = await pool.query(
    `INSERT INTO users (firebase_uid, email, created_at)
     VALUES ($1, $2, NOW())
     RETURNING *`,
    [uid, email]
  );

  return insertResult.rows[0];
}

module.exports = { getOrCreateUser };
