-- Users with location info
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  bio TEXT,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  city VARCHAR(100),
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- Skills user can teach
CREATE TABLE user_teaches (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, skill_id)
);

-- Skills user wants to learn
CREATE TABLE user_learns (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, skill_id)
);

-- Matches between users
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  user1_id INT REFERENCES users(id) ON DELETE CASCADE,
  user2_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_match UNIQUE (user1_id, user2_id)
);

-- Messages between matched users
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  match_id INT REFERENCES matches(id) ON DELETE CASCADE,
  sender_id INT REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Video call sessions
CREATE TABLE calls (
  id SERIAL PRIMARY KEY,
  match_id INT REFERENCES matches(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  call_status VARCHAR(50) DEFAULT 'active'
);

-- Call participants
CREATE TABLE call_participants (
  call_id INT REFERENCES calls(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP,
  PRIMARY KEY (call_id, user_id)
);
