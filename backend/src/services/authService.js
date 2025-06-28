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

  // Insert new user with only Firebase info (basic sign up)
  const insertResult = await pool.query(
    `INSERT INTO users (firebase_uid, email, created_at)
     VALUES ($1, $2, NOW())
     RETURNING *`,
    [uid, email]
  );

  return insertResult.rows[0];
}

async function getUserProfile(uid) {
  const result = await pool.query(
    `SELECT firebase_uid, email, name, bio, city, country, pfp_url, created_at
     FROM users
     WHERE firebase_uid = $1`,
    [uid]
  );

  if (result.rows.length === 0) return null;

  return result.rows[0];
}

async function updateUserProfile(uid, profileData) {
  const { name, bio, city, country, pfp_url } = profileData;

  const updateResult = await pool.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         bio = COALESCE($2, bio),
         city = COALESCE($3, city),
         country = COALESCE($4, country),
         pfp_url = COALESCE($5, pfp_url)
     WHERE firebase_uid = $6
     RETURNING firebase_uid, email, name, bio, city, country, pfp_url, created_at`,
    [name, bio, city, country, pfp_url, uid]
  );

  if (updateResult.rows.length === 0) return null;

  return updateResult.rows[0];
}

module.exports = {
  getOrCreateUser,
  getUserProfile,
  updateUserProfile,
};
