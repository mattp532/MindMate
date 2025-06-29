const pool = require('../db');

/**
 * Get matched users' profiles for a given user ID
 * @param {string} firebaseUid - the user to find matches for
 * @returns {Promise<Array>} - Array of matched users with profile info, skills, interests
 */
exports.getMatchesWithProfiles = async (firebaseUid) => {
  // 1. Find matched user IDs based on verified skills and interests
  // Match logic: User A's verified skills match User B's interests AND User B's verified skills match User A's interests
  const matchSql = `
    SELECT DISTINCT u2.firebase_uid
    FROM user_teaches u1_teaches
    JOIN skill_verifications sv1 ON u1_teaches.skill_id = sv1.skill_id AND sv1.user_firebase_uid = u1_teaches.user_firebase_uid
    JOIN user_learns u2_learns ON u1_teaches.skill_id = u2_learns.skill_id
    JOIN user_learns u1_learns ON u1_learns.user_firebase_uid = u1_teaches.user_firebase_uid
    JOIN user_teaches u2_teaches ON u2_teaches.user_firebase_uid = u2_learns.user_firebase_uid
    JOIN skill_verifications sv2 ON u2_teaches.skill_id = sv2.skill_id AND sv2.user_firebase_uid = u2_teaches.user_firebase_uid
        AND u2_teaches.skill_id = u1_learns.skill_id
    JOIN users u2 ON u2.firebase_uid = u2_teaches.user_firebase_uid
    WHERE u1_teaches.user_firebase_uid = $1
    AND sv1.verified = true
    AND sv2.verified = true
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

  // 3. Fetch skills for all matched users (what they can teach)
  const skillsSql = `
    SELECT ut.user_firebase_uid, s.name AS skill,
           COALESCE(sv.verified, false) as verified,
           sv.verification_score
    FROM user_teaches ut
    JOIN skills s ON s.id = ut.skill_id
    LEFT JOIN skill_verifications sv ON s.id = sv.skill_id AND sv.user_firebase_uid = ut.user_firebase_uid
    WHERE ut.user_firebase_uid = ANY($1)
  `;
  const skillsRes = await pool.query(skillsSql, [matchedIds]);

  // Map user_firebase_uid => array of skills
  const skillsMap = {};
  skillsRes.rows.forEach(({ user_firebase_uid, skill, verified, verification_score }) => {
    if (!skillsMap[user_firebase_uid]) skillsMap[user_firebase_uid] = [];
    skillsMap[user_firebase_uid].push({ 
      name: skill, 
      verified: verified || false, 
      verification_score: verification_score 
    });
  });

  // 4. Fetch interests for all matched users (what they want to learn)
  const interestsSql = `
    SELECT ul.user_firebase_uid, s.name AS interest
    FROM user_learns ul
    JOIN skills s ON s.id = ul.skill_id
    WHERE ul.user_firebase_uid = ANY($1)
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
 * Check if user has verified skills and interests for matching
 * @param {string} firebaseUid - the user to check
 * @returns {Promise<Object>} - Object with hasSkills and hasInterests boolean flags
 */
exports.checkUserMatchingEligibility = async (firebaseUid) => {
  // Check if user has at least one verified skill (what they can teach)
  const skillsSql = `
    SELECT COUNT(*) as skill_count
    FROM user_teaches ut
    JOIN skill_verifications sv ON ut.skill_id = sv.skill_id AND sv.user_firebase_uid = ut.user_firebase_uid
    WHERE ut.user_firebase_uid = $1
    AND sv.verified = true
  `;
  const skillsRes = await pool.query(skillsSql, [firebaseUid]);
  const hasSkills = parseInt(skillsRes.rows[0].skill_count) > 0;

  // Check if user has at least one interest (what they want to learn)
  const interestsSql = `
    SELECT COUNT(*) as interest_count
    FROM user_learns
    WHERE user_firebase_uid = $1
  `;
  const interestsRes = await pool.query(interestsSql, [firebaseUid]);
  const hasInterests = parseInt(interestsRes.rows[0].interest_count) > 0;

  return { hasSkills, hasInterests };
};
