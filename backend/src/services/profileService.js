// services/profileService.js
const pool = require('../db');

exports.getProfile = async (firebaseUid) => {
  const res = await pool.query('SELECT firebase_uid, email, name, bio, city, country, user_type, hourly_rate FROM users WHERE firebase_uid = $1', [firebaseUid]);
  if (res.rows.length === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Fetch user's skills with verification status
  const skillsRes = await pool.query(`
    SELECT s.name, us.verified, us.verification_score, us.verified_at
    FROM skills s 
    JOIN user_skills us ON s.id = us.skill_id 
    WHERE us.user_firebase_uid = $1
    ORDER BY us.created_at DESC
  `, [firebaseUid]);
  
  // Fetch user's interests
  const interestsRes = await pool.query(`
    SELECT s.name 
    FROM skills s 
    JOIN user_interests ui ON s.id = ui.skill_id 
    WHERE ui.user_firebase_uid = $1
    ORDER BY ui.created_at DESC
  `, [firebaseUid]);
  
  const userData = res.rows[0];
  userData.skills = skillsRes.rows.map(row => ({
    name: row.name,
    verified: row.verified,
    verification_score: row.verification_score,
    verified_at: row.verified_at
  }));
  userData.interests = interestsRes.rows.map(row => row.name);
  
  return userData;
};

exports.updateProfile = async (firebaseUid, profileData) => {
  console.log('updateProfile called with firebaseUid:', firebaseUid);
  console.log('profileData:', profileData);
  
  const { 
    fullName, 
    bio, 
    location, 
    skills, 
    interests
  } = profileData;
  
  // Parse location string into city and country
  let city = null;
  let country = null;
  if (location) {
    const locationParts = location.split(',').map(part => part.trim());
    if (locationParts.length >= 2) {
      city = locationParts[0];
      country = locationParts[1];
    } else if (locationParts.length === 1) {
      city = locationParts[0];
    }
  }
  
  console.log('Parsed location - city:', city, 'country:', country);
  
  // Start a transaction
  const client = await pool.connect();
  
  try {
    console.log('Starting database transaction...');
    await client.query('BEGIN');
    
    // First, check if user exists
    console.log('Checking if user exists in database...');
    const userCheckRes = await client.query(
      'SELECT firebase_uid FROM users WHERE firebase_uid = $1',
      [firebaseUid]
    );
    
    console.log('User check result:', userCheckRes.rows);
    
    if (userCheckRes.rows.length === 0) {
      // User doesn't exist, create them automatically
      console.log('User not found in database, creating new user...');
      const createUserRes = await client.query(
        `INSERT INTO users (firebase_uid, display_name, email, bio, city, country, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING *`,
        [firebaseUid, fullName || 'User', null, null, null, null]
      );
      console.log('User created automatically:', createUserRes.rows[0]);
    }
    
    // Update basic user information
    console.log('Updating user information...');
    const userRes = await client.query(
      `UPDATE users SET 
        name = $1, 
        bio = $2, 
        city = $3,
        country = $4
       WHERE firebase_uid = $5 
       RETURNING firebase_uid, email, name, bio, city, country, user_type, hourly_rate`,
      [fullName, bio, city, country, firebaseUid]
    );
    
    console.log('User update result:', userRes.rows);
    
    if (userRes.rows.length === 0) {
      throw new Error('User not found');
    }
    
    // Handle skills (save as unverified initially)
    if (skills && skills.length > 0) {
      console.log('Processing skills:', skills);
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
        
        // Insert or update user skill as unverified
        await client.query(
          `INSERT INTO user_skills (user_firebase_uid, skill_id, verified, verification_score) 
           VALUES ($1, $2, FALSE, NULL) 
           ON CONFLICT (user_firebase_uid, skill_id) DO NOTHING`,
          [firebaseUid, skillId]
        );
      }
    }
    
    // Handle interests
    if (interests && interests.length > 0) {
      console.log('Processing interests:', interests);
      // Clear existing interests for this user
      await client.query('DELETE FROM user_interests WHERE user_firebase_uid = $1', [firebaseUid]);
      
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
          'INSERT INTO user_interests (user_firebase_uid, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [firebaseUid, skillId]
        );
      }
    }
    
    console.log('Committing transaction...');
    await client.query('COMMIT');
    
    return userRes.rows[0];
    
  } catch (error) {
    console.error('Error in updateProfile:', error);
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// New function to update skill verification status
exports.updateSkillVerification = async (firebaseUid, skillName, verified, score) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get skill ID
    const skillRes = await client.query('SELECT id FROM skills WHERE name = $1', [skillName]);
    if (skillRes.rows.length === 0) {
      throw new Error('Skill not found');
    }
    
    const skillId = skillRes.rows[0].id;
    
    // Update verification status
    await client.query(
      `UPDATE user_skills 
       SET verified = $1, verification_score = $2, verified_at = $3
       WHERE user_firebase_uid = $4 AND skill_id = $5`,
      [verified, score, verified ? new Date() : null, firebaseUid, skillId]
    );
    
    await client.query('COMMIT');
    
    return { success: true };
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
