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
    skills, 
    interests
  } = profileData;
  
  // Start a transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Update basic user information
    const userRes = await client.query(
      `UPDATE users SET 
        name = $1, 
        bio = $2, 
        city = $3
       WHERE firebase_uid = $4 
       RETURNING firebase_uid, email, name, bio, city, country, user_type, hourly_rate`,
      [fullName, bio, location, firebaseUid]
    );
    
    if (userRes.rows.length === 0) {
      throw new Error('User not found');
    }
    
    // Handle skills (treat as skills user can teach)
    if (skills && skills.length > 0) {
      // Clear existing skills for this user
      await client.query('DELETE FROM user_teaches WHERE user_firebase_uid = $1', [firebaseUid]);
      
      // Add new skills
      for (const skillName of skills) {
        // Insert skill if it doesn't exist
        let skillRes = await client.query(
          'INSERT INTO skills (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id',
          [skillName]
        );
        
        // Get skill ID (either from insert or existing)
        if (skillRes.rows.length === 0) {
          skillRes = await client.query('SELECT id FROM skills WHERE name = $1', [skillName]);
        }
        
        const skillId = skillRes.rows[0].id;
        
        // Link skill to user
        await client.query(
          'INSERT INTO user_teaches (user_firebase_uid, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [firebaseUid, skillId]
        );
      }
    }
    
    // Handle interests (treat as skills user wants to learn)
    if (interests && interests.length > 0) {
      // Clear existing interests for this user
      await client.query('DELETE FROM user_learns WHERE user_firebase_uid = $1', [firebaseUid]);
      
      // Add new interests
      for (const interestName of interests) {
        // Insert skill if it doesn't exist
        let skillRes = await client.query(
          'INSERT INTO skills (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id',
          [interestName]
        );
        
        // Get skill ID (either from insert or existing)
        if (skillRes.rows.length === 0) {
          skillRes = await client.query('SELECT id FROM skills WHERE name = $1', [interestName]);
        }
        
        const skillId = skillRes.rows[0].id;
        
        // Link interest to user
        await client.query(
          'INSERT INTO user_learns (user_firebase_uid, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [firebaseUid, skillId]
        );
      }
    }
    
    await client.query('COMMIT');
    
    return userRes.rows[0];
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
