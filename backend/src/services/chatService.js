const pool = require('../db');

// Get all users (excluding current user)
async function getAllUsers(currentUserId) {
  const query = `
    SELECT 
      firebase_uid,
      display_name,
      email,
      bio,
      city,
      country,
      user_type,
      created_at
    FROM users 
    WHERE firebase_uid != $1
    ORDER BY display_name
  `;
  
  const result = await pool.query(query, [currentUserId]);
  return result.rows;
}

// Get user's matches
async function getUserMatches(currentUserId) {
  const query = `
    SELECT 
      m.id as match_id,
      m.created_at as match_created_at,
      CASE 
        WHEN m.user1_firebase_uid = $1 THEN m.user2_firebase_uid
        ELSE m.user1_firebase_uid
      END as other_user_id,
      u.display_name,
      u.email,
      u.bio,
      u.city,
      u.country,
      u.user_type
    FROM matches m
    JOIN users u ON (
      CASE 
        WHEN m.user1_firebase_uid = $1 THEN m.user2_firebase_uid
        ELSE m.user1_firebase_uid
      END = u.firebase_uid
    )
    WHERE m.user1_firebase_uid = $1 OR m.user2_firebase_uid = $1
    ORDER BY m.created_at DESC
  `;
  
  const result = await pool.query(query, [currentUserId]);
  return result.rows;
}

// Check if user is part of a match
async function isUserInMatch(userId, matchId) {
  const query = `
    SELECT COUNT(*) as count
    FROM matches
    WHERE id = $1 AND (user1_firebase_uid = $2 OR user2_firebase_uid = $2)
  `;
  
  const result = await pool.query(query, [matchId, userId]);
  return result.rows[0].count > 0;
}

// Get messages for a specific match
async function getMatchMessages(matchId) {
  const query = `
    SELECT 
      m.id,
      m.content,
      m.sent_at,
      m.sender_firebase_uid,
      u.display_name as sender_name
    FROM messages m
    JOIN users u ON m.sender_firebase_uid = u.firebase_uid
    WHERE m.match_id = $1
    ORDER BY m.sent_at ASC
  `;
  
  const result = await pool.query(query, [matchId]);
  return result.rows;
}

// Create a new match
async function createMatch(user1Id, user2Id) {
  try {
    console.log('Creating match between:', user1Id, 'and', user2Id);
    
    // First, verify both users exist
    const user1Check = await pool.query('SELECT firebase_uid FROM users WHERE firebase_uid = $1', [user1Id]);
    const user2Check = await pool.query('SELECT firebase_uid FROM users WHERE firebase_uid = $1', [user2Id]);
    
    if (user1Check.rows.length === 0) {
      throw new Error(`User ${user1Id} not found in database`);
    }
    
    if (user2Check.rows.length === 0) {
      throw new Error(`User ${user2Id} not found in database`);
    }
    
    console.log('Both users verified in database');
    
    // Check if match already exists
    const existingMatchQuery = `
      SELECT id FROM matches 
      WHERE (user1_firebase_uid = $1 AND user2_firebase_uid = $2)
         OR (user1_firebase_uid = $2 AND user2_firebase_uid = $1)
    `;
    
    const existingMatch = await pool.query(existingMatchQuery, [user1Id, user2Id]);
    if (existingMatch.rows.length > 0) {
      console.log('Match already exists');
      const error = new Error('Match already exists');
      error.statusCode = 409;
      throw error;
    }
    
    console.log('No existing match found, creating new match');
    
    // Create new match
    const insertQuery = `
      INSERT INTO matches (user1_firebase_uid, user2_firebase_uid)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [user1Id, user2Id]);
    console.log('Match created successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in createMatch:', error);
    throw error;
  }
}

// Send a message
async function sendMessage(matchId, senderId, content) {
  const query = `
    INSERT INTO messages (match_id, sender_firebase_uid, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  
  const result = await pool.query(query, [matchId, senderId, content]);
  return result.rows[0];
}

// Get user's conversations (matches with recent messages)
async function getConversations(currentUserId) {
  const query = `
    WITH latest_messages AS (
      SELECT 
        match_id,
        MAX(sent_at) as latest_message_time
      FROM messages
      GROUP BY match_id
    ),
    match_with_latest AS (
      SELECT 
        m.id as match_id,
        m.created_at as match_created_at,
        CASE 
          WHEN m.user1_firebase_uid = $1 THEN m.user2_firebase_uid
          ELSE m.user1_firebase_uid
        END as other_user_id,
        u.display_name,
        u.email,
        u.bio,
        u.city,
        u.country,
        u.user_type,
        lm.latest_message_time,
        (
          SELECT content 
          FROM messages 
          WHERE match_id = m.id 
          ORDER BY sent_at DESC 
          LIMIT 1
        ) as last_message_content,
        (
          SELECT COUNT(*) 
          FROM messages 
          WHERE match_id = m.id 
          AND sender_firebase_uid != $1
          AND sent_at > COALESCE(
            (SELECT MAX(sent_at) FROM messages WHERE match_id = m.id AND sender_firebase_uid = $1), 
            '1970-01-01'::timestamp
          )
        ) as unread_count
      FROM matches m
      JOIN users u ON (
        CASE 
          WHEN m.user1_firebase_uid = $1 THEN m.user2_firebase_uid
          ELSE m.user1_firebase_uid
        END = u.firebase_uid
      )
      LEFT JOIN latest_messages lm ON m.id = lm.match_id
      WHERE m.user1_firebase_uid = $1 OR m.user2_firebase_uid = $1
    )
    SELECT *
    FROM match_with_latest
    ORDER BY COALESCE(latest_message_time, match_created_at) DESC
  `;
  
  const result = await pool.query(query, [currentUserId]);
  return result.rows;
}

module.exports = {
  getAllUsers,
  getUserMatches,
  isUserInMatch,
  getMatchMessages,
  createMatch,
  sendMessage,
  getConversations
}; 