const pool = require('../db');

async function createUser(firebaseUser, profileData = {}) {
  const { uid, email } = firebaseUser;
  
  // Use displayName from frontend, fallback to 'User' if not provided
  const displayName = profileData.displayName || 'User';

  // Parse location string into city and country
  let city = null;
  let country = null;
  if (profileData.location) {
    const locationParts = profileData.location.split(',').map(part => part.trim());
    if (locationParts.length >= 2) {
      city = locationParts[0];
      country = locationParts[1];
    } else if (locationParts.length === 1) {
      city = locationParts[0];
    }
  }

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

  // Insert new user with only display_name (name will be NULL initially)
  const insertResult = await pool.query(
    `INSERT INTO users (firebase_uid, display_name, email, bio, city, country, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     RETURNING *`,
    [
      uid, 
      displayName, 
      email, 
      profileData.bio || null,
      city,
      country
    ]
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
