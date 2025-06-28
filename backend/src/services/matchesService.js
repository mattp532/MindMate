const pool = require('../db');

/**
 * Get matched users' profiles for a given user ID
 * @param {string} firebaseUid - the user to find matches for
 * @returns {Promise<Array>} - Array of matched users with profile info, skills, interests
 */
exports.getMatchesWithProfiles = async (firebaseUid) => {
  // 1. Find matched user IDs based on skills and interests
  // Match logic: User A's skills match User B's interests AND User B's skills match User A's interests
  const matchSql = `
    SELECT DISTINCT u2.firebase_uid
    FROM user_skills u1_skills
    JOIN user_interests u2_interests ON u1_skills.skill_id = u2_interests.skill_id
    JOIN user_interests u1_interests ON u1_interests.user_firebase_uid = u1_skills.user_firebase_uid
    JOIN user_skills u2_skills ON u2_skills.user_firebase_uid = u2_interests.user_firebase_uid
        AND u2_skills.skill_id = u1_interests.skill_id
    JOIN users u2 ON u2.firebase_uid = u2_skills.user_firebase_uid
    WHERE u1_skills.user_firebase_uid = $1
    AND u2.firebase_uid != $1; -- Don't match with yourself
  `;

  const matchedIdsRes = await pool.query(matchSql, [firebaseUid]);
  const matchedIds = matchedIdsRes.rows.map(row => row.firebase_uid);

  if (matchedIds.length === 0) {
    return []; // no matches found
  }

  // 2. Fetch profiles for matched users
  const profilesSql = `
    SELECT firebase_uid, email, name, bio, city, country
    FROM users
    WHERE firebase_uid = ANY($1)
  `;
  const profilesRes = await pool.query(profilesSql, [matchedIds]);
  const profiles = profilesRes.rows;

  // 3. Fetch skills for all matched users
  const skillsSql = `
    SELECT us.user_firebase_uid, s.name AS skill, us.verified, us.verification_score
    FROM user_skills us
    JOIN skills s ON s.id = us.skill_id
    WHERE us.user_firebase_uid = ANY($1)
  `;
  const skillsRes = await pool.query(skillsSql, [matchedIds]);

  // Map user_firebase_uid => array of skills
  const skillsMap = {};
  skillsRes.rows.forEach(({ user_firebase_uid, skill, verified, verification_score }) => {
    if (!skillsMap[user_firebase_uid]) skillsMap[user_firebase_uid] = [];
    skillsMap[user_firebase_uid].push({ name: skill, verified, verification_score });
  });

  // 4. Fetch interests for all matched users
  const interestsSql = `
    SELECT ui.user_firebase_uid, s.name AS interest
    FROM user_interests ui
    JOIN skills s ON s.id = ui.skill_id
    WHERE ui.user_firebase_uid = ANY($1)
  `;
  const interestsRes = await pool.query(interestsSql, [matchedIds]);

  // Map user_firebase_uid => array of interests
  const interestsMap = {};
  interestsRes.rows.forEach(({ user_firebase_uid, interest }) => {
    if (!interestsMap[user_firebase_uid]) interestsMap[user_firebase_uid] = [];
    interestsMap[user_firebase_uid].push(interest);
  });

  // 5. Combine profiles with skills and interests
  const matchedUsers = profiles.map(user => ({
    ...user,
    skills: skillsMap[user.firebase_uid] || [],
    interests: interestsMap[user.firebase_uid] || [],
  }));

  return matchedUsers;
};

/**
 * Check if user has skills and interests for matching
 * @param {string} firebaseUid - the user to check
 * @returns {Promise<Object>} - Object with hasSkills and hasInterests boolean flags
 */
exports.checkUserMatchingEligibility = async (firebaseUid) => {
  // Check if user has at least one verified skill
  const skillsSql = `
    SELECT COUNT(*) as skill_count
    FROM user_skills
    WHERE user_firebase_uid = $1 AND verified = true
  `;
  const skillsRes = await pool.query(skillsSql, [firebaseUid]);
  const hasSkills = parseInt(skillsRes.rows[0].skill_count) > 0;

  // Check if user has at least one interest
  const interestsSql = `
    SELECT COUNT(*) as interest_count
    FROM user_interests
    WHERE user_firebase_uid = $1
  `;
  const interestsRes = await pool.query(interestsSql, [firebaseUid]);
  const hasInterests = parseInt(interestsRes.rows[0].interest_count) > 0;

  return { hasSkills, hasInterests };
};
