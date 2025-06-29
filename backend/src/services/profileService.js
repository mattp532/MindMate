// services/profileService.js
const pool = require('../db');

// New function to get all available skills
exports.getAllSkills = async () => {
  const res = await pool.query('SELECT id, name FROM skills ORDER BY name');
  return res.rows;
};

// New function to get skill distribution statistics
exports.getSkillDistribution = async () => {
  // Get all skills with counts of teachers and learners
  const skillStatsSql = `
    SELECT 
      s.id,
      s.name,
      COUNT(DISTINCT ut.user_firebase_uid) as teachers_count,
      COUNT(DISTINCT ul.user_firebase_uid) as learners_count
    FROM skills s
    LEFT JOIN user_teaches ut ON s.id = ut.skill_id
    LEFT JOIN user_learns ul ON s.id = ul.skill_id
    GROUP BY s.id, s.name
    ORDER BY s.name
  `;
  
  const skillStatsRes = await pool.query(skillStatsSql);
  
  // Get specific Python learners
  const pythonLearnersSql = `
    SELECT u.name, u.email, u.city, u.country
    FROM users u
    JOIN user_learns ul ON u.firebase_uid = ul.user_firebase_uid
    JOIN skills s ON ul.skill_id = s.id
    WHERE s.name = 'Python'
  `;
  
  const pythonLearnersRes = await pool.query(pythonLearnersSql);
  
  // Get all teachers (people who can teach any skill)
  const allTeachersSql = `
    SELECT DISTINCT u.name, u.email, u.city, u.country
    FROM users u
    JOIN user_teaches ut ON u.firebase_uid = ut.user_firebase_uid
  `;
  
  const allTeachersRes = await pool.query(allTeachersSql);
  
  return {
    skillStats: skillStatsRes.rows,
    pythonLearners: pythonLearnersRes.rows,
    allTeachers: allTeachersRes.rows,
    totalSkills: skillStatsRes.rows.length,
    totalTeachers: allTeachersRes.rows.length,
    totalPythonLearners: pythonLearnersRes.rows.length
  };
};

exports.getProfile = async (firebaseUid) => {
  const res = await pool.query('SELECT firebase_uid, email, name, bio, city, country FROM users WHERE firebase_uid = $1', [firebaseUid]);
  if (res.rows.length === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Fetch user's skills (what they can teach)
  const skillsRes = await pool.query(`
    SELECT s.name, s.id,
           COALESCE(sv.verified, false) as verified,
           sv.verification_score
    FROM skills s 
    JOIN user_teaches ut ON s.id = ut.skill_id 
    LEFT JOIN skill_verifications sv ON s.id = sv.skill_id AND sv.user_firebase_uid = $1
    WHERE ut.user_firebase_uid = $1
    ORDER BY s.name
  `, [firebaseUid]);
  
  // Fetch user's interests (what they want to learn)
  const interestsRes = await pool.query(`
    SELECT s.name 
    FROM skills s 
    JOIN user_learns ul ON s.id = ul.skill_id 
    WHERE ul.user_firebase_uid = $1
    ORDER BY s.name
  `, [firebaseUid]);
  
  const userData = res.rows[0];
  userData.skills = skillsRes.rows.map(row => ({
    name: row.name,
    verified: row.verified,
    verification_score: row.verification_score
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
        display_name = $1,
        bio = $2, 
        city = $3,
        country = $4
       WHERE firebase_uid = $5 
       RETURNING firebase_uid, email, name, display_name, bio, city, country, user_type, hourly_rate`,
      [fullName, bio, city, country, firebaseUid]
    );
    
    console.log('User update result:', userRes.rows);
    
    if (userRes.rows.length === 0) {
      throw new Error('User not found');
    }
    
    // Handle skills (what user can teach)
    if (skills && skills.length > 0) {
<<<<<<< HEAD
      // Clear existing skills for this user
      await client.query('DELETE FROM user_teaches WHERE user_firebase_uid = $1', [firebaseUid]);
      
      // Add new skills
=======
      console.log('Processing skills:', skills);
>>>>>>> 7385acdd79898e59a0a815fa75ee36d651b182b2
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
        
        // Link skill to user as teaching skill
        await client.query(
          'INSERT INTO user_teaches (user_firebase_uid, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [firebaseUid, skillId]
        );
      }
    }
    
    // Handle interests (what user wants to learn)
    if (interests && interests.length > 0) {
      console.log('Processing interests:', interests);
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
        
        // Link interest to user as learning skill
        await client.query(
          'INSERT INTO user_learns (user_firebase_uid, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
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

// Update skill verification function to work with the new schema
exports.updateSkillVerification = async (firebaseUid, skillName, verified, score) => {
  // Use the new skill_verifications table to store verification data
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get skill ID
    const skillRes = await client.query('SELECT id FROM skills WHERE name = $1', [skillName]);
    if (skillRes.rows.length === 0) {
      throw new Error('Skill not found');
    }
    
    const skillId = skillRes.rows[0].id;
    
    // Check if user can teach this skill (exists in user_teaches)
    const teachesRes = await client.query(
      'SELECT 1 FROM user_teaches WHERE user_firebase_uid = $1 AND skill_id = $2',
      [firebaseUid, skillId]
    );
    
    if (teachesRes.rows.length === 0) {
      throw new Error('User does not have this skill to verify');
    }
    
    // Update or insert verification record
    await client.query(`
      INSERT INTO skill_verifications (user_firebase_uid, skill_id, verified, verification_score, verified_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (user_firebase_uid, skill_id) 
      DO UPDATE SET 
        verified = $3,
        verification_score = $4,
        verified_at = CURRENT_TIMESTAMP
    `, [firebaseUid, skillId, verified, score]);
    
    await client.query('COMMIT');
    
    return { success: true };
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Remove a skill from user's profile
exports.removeSkill = async (firebaseUid, skillName) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get skill ID
    const skillRes = await client.query('SELECT id FROM skills WHERE name = $1', [skillName]);
    if (skillRes.rows.length === 0) {
      throw new Error('Skill not found');
    }
    
    const skillId = skillRes.rows[0].id;
    
    // Remove skill from user_teaches (what user can teach)
    await client.query(
      'DELETE FROM user_teaches WHERE user_firebase_uid = $1 AND skill_id = $2',
      [firebaseUid, skillId]
    );
    
    // Remove skill verification record if it exists
    await client.query(
      'DELETE FROM skill_verifications WHERE user_firebase_uid = $1 AND skill_id = $2',
      [firebaseUid, skillId]
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

// Remove an interest from user's profile
exports.removeInterest = async (firebaseUid, interestName) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get skill ID (interests are stored as skills)
    const skillRes = await client.query('SELECT id FROM skills WHERE name = $1', [interestName]);
    if (skillRes.rows.length === 0) {
      throw new Error('Interest not found');
    }
    
    const skillId = skillRes.rows[0].id;
    
    // Remove interest from user_learns (what user wants to learn)
    await client.query(
      'DELETE FROM user_learns WHERE user_firebase_uid = $1 AND skill_id = $2',
      [firebaseUid, skillId]
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
