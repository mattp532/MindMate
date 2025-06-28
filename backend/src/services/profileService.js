// services/profileService.js
const pool = require('../db');

exports.getProfile = async (firebaseUid) => {
  const res = await pool.query('SELECT firebase_uid, email, name, bio, city, country, user_type, hourly_rate FROM users WHERE firebase_uid = $1', [firebaseUid]);
  if (res.rows.length === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return res.rows[0];
};

exports.updateProfile = async (firebaseUid, profileData) => {
  const { 
    fullName, 
    bio, 
    location, 
    userType, 
    skills, 
    hourlyRate
  } = profileData;
  
  // Use fullName from the profile form to update the name field
  // Keep display_name unchanged (it was set during initial signup)
  const res = await pool.query(
    `UPDATE users SET 
      name = $1, 
      bio = $2, 
      city = $3, 
      user_type = $4, 
      hourly_rate = $5 
     WHERE firebase_uid = $6 
     RETURNING firebase_uid, email, name, bio, city, country, user_type, hourly_rate`,
    [fullName, bio, location, userType, hourlyRate, firebaseUid]
  );
  
  if (res.rows.length === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  
  return res.rows[0];
};
