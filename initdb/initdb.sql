-- Users identified by Firebase UID
CREATE TABLE users (
  firebase_uid VARCHAR(128) PRIMARY KEY, -- Firebase UID is a string (~28 chars, so 128 is safe)
  display_name VARCHAR(100) NOT NULL,
  name VARCHAR(100), -- Optional full name, can be filled in during profile completion
  email VARCHAR(100) UNIQUE NOT NULL,
  bio TEXT,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  city VARCHAR(100),
  country VARCHAR(100),
  user_type VARCHAR(20) DEFAULT 'student', -- 'student' or 'teacher'
  hourly_rate NUMERIC(8,2), -- For teachers
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- Skills user can teach
CREATE TABLE user_teaches (
  user_firebase_uid VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE CASCADE,
  skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (user_firebase_uid, skill_id)
);

-- Skills user wants to learn
CREATE TABLE user_learns (
  user_firebase_uid VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE CASCADE,
  skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (user_firebase_uid, skill_id)
);

-- Matches between users
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  user1_firebase_uid VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE CASCADE,
  user2_firebase_uid VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_match UNIQUE (user1_firebase_uid, user2_firebase_uid)
);

-- Messages between matched users
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  match_id INT REFERENCES matches(id) ON DELETE CASCADE,
  sender_firebase_uid VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE CASCADE,
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
  user_firebase_uid VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP,
  PRIMARY KEY (call_id, user_firebase_uid)
);

-- Skill verifications
CREATE TABLE skill_verifications (
  id SERIAL PRIMARY KEY,
  user_firebase_uid VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE CASCADE,
  skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
  verified BOOLEAN DEFAULT FALSE,
  verification_score NUMERIC(5,2), -- Score from 0-100
  verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_firebase_uid, skill_id)
);

-- Insert sample skills
INSERT INTO skills (name) VALUES
-- Programming skills
('JavaScript'), ('Python'), ('React'), ('Node.js'), ('Java'), ('C++'), ('SQL'), ('Git'), ('Docker'), ('AWS'),
-- Language skills
('English'), ('Spanish'), ('French'), ('German'), ('Japanese'), ('Mandarin'), ('Italian'), ('Portuguese'), ('Russian'), ('Arabic'),
-- Music skills
('Piano'), ('Guitar'), ('Violin'), ('Drums'), ('Singing'), ('Music Theory'), ('Composition'), ('Jazz'), ('Classical'), ('Rock'),
-- Other skills
('Cooking'), ('Photography'), ('Drawing'), ('Yoga'), ('Meditation'), ('Chess'), ('Public Speaking'), ('Creative Writing');

-- Insert sample users
INSERT INTO users (firebase_uid, display_name, name, email, bio, latitude, longitude, city, country, user_type, hourly_rate) VALUES
-- Programming-focused users
('user_programmer_1', 'Alex Chen', 'Alex Chen', 'alex.chen@example.com', 'Full-stack developer passionate about React and Node.js. Love teaching beginners!', 40.7128, -74.0060, 'New York', 'USA', 'teacher', 45.00),
('user_programmer_2', 'Sarah Kim', 'Sarah Kim', 'sarah.kim@example.com', 'Python enthusiast and data scientist. Always excited to learn new technologies.', 34.0522, -118.2437, 'Los Angeles', 'USA', 'student', NULL),
('user_programmer_3', 'Marcus Johnson', 'Marcus Johnson', 'marcus.j@example.com', 'Senior Java developer with 8 years experience. Specialize in enterprise applications.', 41.8781, -87.6298, 'Chicago', 'USA', 'teacher', 60.00),
('user_programmer_4', 'Emma Wilson', 'Emma Wilson', 'emma.wilson@example.com', 'Frontend developer learning React. Would love to connect with experienced developers!', 51.5074, -0.1278, 'London', 'UK', 'student', NULL),

-- Language-focused users
('user_language_1', 'Maria Garcia', 'Maria Garcia', 'maria.garcia@example.com', 'Native Spanish speaker and certified language teacher. Love sharing my culture!', 40.4168, -3.7038, 'Madrid', 'Spain', 'teacher', 35.00),
('user_language_2', 'Yuki Tanaka', 'Yuki Tanaka', 'yuki.tanaka@example.com', 'Japanese language tutor with 5 years experience. Patient and encouraging teacher.', 35.6762, 139.6503, 'Tokyo', 'Japan', 'teacher', 40.00),
('user_language_3', 'Pierre Dubois', 'Pierre Dubois', 'pierre.dubois@example.com', 'French native speaker learning English. Love discussing literature and philosophy.', 48.8566, 2.3522, 'Paris', 'France', 'student', NULL),
('user_language_4', 'Anna Mueller', 'Anna Mueller', 'anna.mueller@example.com', 'German teacher and translator. Passionate about helping others learn German.', 52.5200, 13.4050, 'Berlin', 'Germany', 'teacher', 38.00),

-- Music-focused users
('user_music_1', 'David Rodriguez', 'David Rodriguez', 'david.rodriguez@example.com', 'Professional pianist and music theory instructor. Classical and jazz specialist.', 25.7617, -80.1918, 'Miami', 'USA', 'teacher', 50.00),
('user_music_2', 'Lisa Park', 'Lisa Park', 'lisa.park@example.com', 'Violinist with 15 years experience. Love teaching beginners and intermediate players.', 37.7749, -122.4194, 'San Francisco', 'USA', 'teacher', 45.00),
('user_music_3', 'Tom Anderson', 'Tom Anderson', 'tom.anderson@example.com', 'Guitar enthusiast learning piano. Rock and blues lover!', 55.6761, 12.5683, 'Copenhagen', 'Denmark', 'student', NULL),
('user_music_4', 'Sophie Martin', 'Sophie Martin', 'sophie.martin@example.com', 'Music composition student. Looking for guidance in jazz theory and piano.', 45.5017, -73.5673, 'Montreal', 'Canada', 'student', NULL),

-- Multi-skilled users
('user_multi_1', 'Carlos Silva', 'Carlos Silva', 'carlos.silva@example.com', 'Software engineer who also teaches Portuguese and plays guitar. Love connecting through multiple interests!', -23.5505, -46.6333, 'São Paulo', 'Brazil', 'teacher', 42.00),
('user_multi_2', 'Nina Patel', 'Nina Patel', 'nina.patel@example.com', 'Learning Python and French while teaching yoga. Balance in life and code!', 19.0760, 72.8777, 'Mumbai', 'India', 'student', NULL),
('user_multi_3', 'Lucas Berg', 'Lucas Berg', 'lucas.berg@example.com', 'Swedish developer learning Spanish and piano. Always excited to meet new people!', 59.3293, 18.0686, 'Stockholm', 'Sweden', 'student', NULL),
('user_multi_4', 'Isabella Costa', 'Isabella Costa', 'isabella.costa@example.com', 'Italian teacher of English and music. Passionate about cultural exchange.', 41.9028, 12.4964, 'Rome', 'Italy', 'teacher', 36.00),

-- New users for each unique skill who teach that skill and want to learn Python
-- Programming Skills
('teacher_aws', 'Alex Thompson', 'Alex Thompson', 'alex.thompson@example.com', 'AWS Solutions Architect with 6 years experience. Passionate about cloud computing and always eager to learn Python!', 47.6062, -122.3321, 'Seattle', 'USA', 'teacher', 55.00),
('teacher_cpp', 'Michael Chen', 'Michael Chen', 'michael.chen@example.com', 'C++ expert specializing in systems programming and game development. Looking to expand into Python for data science!', 42.3601, -71.0589, 'Boston', 'USA', 'teacher', 65.00),
('teacher_docker', 'Sarah Williams', 'Sarah Williams', 'sarah.williams@example.com', 'DevOps engineer and Docker specialist. Love containerization and excited to learn Python for automation!', 29.7604, -95.3698, 'Houston', 'USA', 'teacher', 50.00),
('teacher_git', 'David Kim', 'David Kim', 'david.kim@example.com', 'Git expert and version control specialist. Passionate about collaborative development and eager to learn Python!', 39.7392, -104.9903, 'Denver', 'USA', 'teacher', 45.00),

-- Language Skills
('teacher_arabic', 'Fatima Al-Zahra', 'Fatima Al-Zahra', 'fatima.alzahra@example.com', 'Native Arabic speaker and certified teacher. Love sharing Arabic culture and excited to learn Python for educational technology!', 24.7136, 46.6753, 'Riyadh', 'Saudi Arabia', 'teacher', 40.00),
('teacher_mandarin', 'Li Wei', 'Li Wei', 'li.wei@example.com', 'Mandarin teacher with 8 years experience. Passionate about Chinese culture and eager to learn Python for language learning apps!', 39.9042, 116.4074, 'Beijing', 'China', 'teacher', 45.00),
('teacher_russian', 'Elena Petrov', 'Elena Petrov', 'elena.petrov@example.com', 'Russian language instructor and translator. Love teaching Russian literature and excited to learn Python!', 55.7558, 37.6176, 'Moscow', 'Russia', 'teacher', 42.00),

-- Music Skills
('teacher_drums', 'Marcus Davis', 'Marcus Davis', 'marcus.davis@example.com', 'Professional drummer with 12 years experience. Love teaching rhythm and excited to learn Python for music production!', 33.7490, -84.3880, 'Atlanta', 'USA', 'teacher', 48.00),
('teacher_singing', 'Emma Rodriguez', 'Emma Rodriguez', 'emma.rodriguez@example.com', 'Vocal coach and professional singer. Passionate about voice training and eager to learn Python for audio processing!', 32.7767, -96.7970, 'Dallas', 'USA', 'teacher', 52.00),
('teacher_composition', 'James Wilson', 'James Wilson', 'james.wilson@example.com', 'Music composer and arranger. Love teaching music theory and excited to learn Python for algorithmic composition!', 40.7128, -74.0060, 'New York', 'USA', 'teacher', 58.00),
('teacher_rock', 'Chris Johnson', 'Chris Johnson', 'chris.johnson@example.com', 'Rock guitarist and music producer. Passionate about rock music and eager to learn Python for music analysis!', 34.0522, -118.2437, 'Los Angeles', 'USA', 'teacher', 50.00),

-- Other Skills
('teacher_cooking', 'Maria Santos', 'Maria Santos', 'maria.santos@example.com', 'Professional chef and cooking instructor. Love teaching culinary arts and excited to learn Python for recipe management!', 25.7617, -80.1918, 'Miami', 'USA', 'teacher', 45.00),
('teacher_photography', 'John Smith', 'John Smith', 'john.smith@example.com', 'Professional photographer and instructor. Passionate about visual arts and eager to learn Python for image processing!', 37.7749, -122.4194, 'San Francisco', 'USA', 'teacher', 55.00),
('teacher_drawing', 'Anna Lee', 'Anna Lee', 'anna.lee@example.com', 'Art instructor and illustrator. Love teaching drawing techniques and excited to learn Python for digital art!', 47.6062, -122.3321, 'Seattle', 'USA', 'teacher', 48.00),
('teacher_meditation', 'Priya Patel', 'Priya Patel', 'priya.patel@example.com', 'Meditation instructor and wellness coach. Passionate about mindfulness and eager to learn Python for wellness apps!', 19.0760, 72.8777, 'Mumbai', 'India', 'teacher', 42.00),
('teacher_chess', 'Viktor Petrov', 'Viktor Petrov', 'viktor.petrov@example.com', 'Chess master and instructor. Love teaching strategy and excited to learn Python for chess AI!', 55.7558, 37.6176, 'Moscow', 'Russia', 'teacher', 50.00),
('teacher_public_speaking', 'Rachel Green', 'Rachel Green', 'rachel.green@example.com', 'Public speaking coach and communication expert. Passionate about helping people find their voice and eager to learn Python!', 40.7128, -74.0060, 'New York', 'USA', 'teacher', 60.00),
('teacher_creative_writing', 'Daniel Brown', 'Daniel Brown', 'daniel.brown@example.com', 'Creative writing instructor and published author. Love teaching storytelling and excited to learn Python for text analysis!', 51.5074, -0.1278, 'London', 'UK', 'teacher', 55.00);

-- Insert teaching relationships
INSERT INTO user_teaches (user_firebase_uid, skill_id) VALUES
-- Programming teachers
('user_programmer_1', (SELECT id FROM skills WHERE name = 'JavaScript')),
('user_programmer_1', (SELECT id FROM skills WHERE name = 'React')),
('user_programmer_1', (SELECT id FROM skills WHERE name = 'Node.js')),
('user_programmer_3', (SELECT id FROM skills WHERE name = 'Java')),
('user_programmer_3', (SELECT id FROM skills WHERE name = 'C++')),
('user_programmer_3', (SELECT id FROM skills WHERE name = 'SQL')),

-- Language teachers
('user_language_1', (SELECT id FROM skills WHERE name = 'Spanish')),
('user_language_2', (SELECT id FROM skills WHERE name = 'Japanese')),
('user_language_4', (SELECT id FROM skills WHERE name = 'German')),
('user_multi_4', (SELECT id FROM skills WHERE name = 'English')),

-- Music teachers
('user_music_1', (SELECT id FROM skills WHERE name = 'Piano')),
('user_music_1', (SELECT id FROM skills WHERE name = 'Music Theory')),
('user_music_1', (SELECT id FROM skills WHERE name = 'Jazz')),
('user_music_2', (SELECT id FROM skills WHERE name = 'Violin')),
('user_music_2', (SELECT id FROM skills WHERE name = 'Classical')),

-- Multi-skilled teachers
('user_multi_1', (SELECT id FROM skills WHERE name = 'JavaScript')),
('user_multi_1', (SELECT id FROM skills WHERE name = 'Portuguese')),
('user_multi_1', (SELECT id FROM skills WHERE name = 'Guitar')),
('user_multi_4', (SELECT id FROM skills WHERE name = 'Piano')),
('user_multi_4', (SELECT id FROM skills WHERE name = 'Italian')),

-- New skill-specific teachers
-- Programming Skills
('teacher_aws', (SELECT id FROM skills WHERE name = 'AWS')),
('teacher_cpp', (SELECT id FROM skills WHERE name = 'C++')),
('teacher_docker', (SELECT id FROM skills WHERE name = 'Docker')),
('teacher_git', (SELECT id FROM skills WHERE name = 'Git')),

-- Language Skills
('teacher_arabic', (SELECT id FROM skills WHERE name = 'Arabic')),
('teacher_mandarin', (SELECT id FROM skills WHERE name = 'Mandarin')),
('teacher_russian', (SELECT id FROM skills WHERE name = 'Russian')),

-- Music Skills
('teacher_drums', (SELECT id FROM skills WHERE name = 'Drums')),
('teacher_singing', (SELECT id FROM skills WHERE name = 'Singing')),
('teacher_composition', (SELECT id FROM skills WHERE name = 'Composition')),
('teacher_rock', (SELECT id FROM skills WHERE name = 'Rock')),

-- Other Skills
('teacher_cooking', (SELECT id FROM skills WHERE name = 'Cooking')),
('teacher_photography', (SELECT id FROM skills WHERE name = 'Photography')),
('teacher_drawing', (SELECT id FROM skills WHERE name = 'Drawing')),
('teacher_meditation', (SELECT id FROM skills WHERE name = 'Meditation')),
('teacher_chess', (SELECT id FROM skills WHERE name = 'Chess')),
('teacher_public_speaking', (SELECT id FROM skills WHERE name = 'Public Speaking')),
('teacher_creative_writing', (SELECT id FROM skills WHERE name = 'Creative Writing'));

-- Insert learning relationships
INSERT INTO user_learns (user_firebase_uid, skill_id) VALUES
-- Programming students
('user_programmer_2', (SELECT id FROM skills WHERE name = 'React')),
('user_programmer_2', (SELECT id FROM skills WHERE name = 'Docker')),
('user_programmer_4', (SELECT id FROM skills WHERE name = 'Node.js')),
('user_programmer_4', (SELECT id FROM skills WHERE name = 'Python')),

-- Language students
('user_language_3', (SELECT id FROM skills WHERE name = 'English')),
('user_multi_2', (SELECT id FROM skills WHERE name = 'French')),
('user_multi_3', (SELECT id FROM skills WHERE name = 'Spanish')),

-- Music students
('user_music_3', (SELECT id FROM skills WHERE name = 'Piano')),
('user_music_3', (SELECT id FROM skills WHERE name = 'Music Theory')),
('user_music_4', (SELECT id FROM skills WHERE name = 'Jazz')),
('user_music_4', (SELECT id FROM skills WHERE name = 'Piano')),

-- Multi-skilled students
('user_multi_2', (SELECT id FROM skills WHERE name = 'Python')),
('user_multi_3', (SELECT id FROM skills WHERE name = 'JavaScript')),
('user_multi_3', (SELECT id FROM skills WHERE name = 'Piano')),

-- New skill-specific teachers who want to learn Python
-- Programming Skills
('teacher_aws', (SELECT id FROM skills WHERE name = 'Python')),
('teacher_cpp', (SELECT id FROM skills WHERE name = 'Python')),
('teacher_docker', (SELECT id FROM skills WHERE name = 'Python')),
('teacher_git', (SELECT id FROM skills WHERE name = 'Python')),

-- Language Skills
('teacher_arabic', (SELECT id FROM skills WHERE name = 'Python')),
('teacher_mandarin', (SELECT id FROM skills WHERE name = 'Python')),
('teacher_russian', (SELECT id FROM skills WHERE name = 'Python')),

-- Music Skills
('teacher_drums', (SELECT id FROM skills WHERE name = 'Python')),
('teacher_singing', (SELECT id FROM skills WHERE name = 'Python')),
('teacher_composition', (SELECT id FROM skills WHERE name = 'Python')),
('teacher_rock', (SELECT id FROM skills WHERE name = 'Python')),

-- Other Skills
('teacher_cooking', (SELECT id FROM skills WHERE name = 'Python')),
('teacher_photography', (SELECT id FROM skills WHERE name = 'Python')),
('teacher_drawing', (SELECT id FROM skills WHERE name = 'Python')),
('teacher_meditation', (SELECT id FROM skills WHERE name = 'Python')),
('teacher_chess', (SELECT id FROM skills WHERE name = 'Python')),
('teacher_public_speaking', (SELECT id FROM skills WHERE name = 'Python')),
('teacher_creative_writing', (SELECT id FROM skills WHERE name = 'Python'));

-- Insert some sample matches
INSERT INTO matches (user1_firebase_uid, user2_firebase_uid) VALUES
-- Programming matches
('user_programmer_1', 'user_programmer_4'), -- React teacher and student
('user_programmer_3', 'user_programmer_2'), -- Java teacher and Python student

-- Language matches
('user_language_1', 'user_language_3'), -- Spanish teacher and French student
('user_language_2', 'user_multi_2'), -- Japanese teacher and French learner

-- Music matches
('user_music_1', 'user_music_4'), -- Piano teacher and composition student
('user_music_2', 'user_music_3'), -- Violin teacher and guitar student

-- Cross-domain matches
('user_programmer_1', 'user_multi_1'), -- JavaScript teacher and Portuguese teacher
('user_language_4', 'user_multi_3'), -- German teacher and Spanish learner
('user_music_1', 'user_multi_4'); -- Piano teacher and Italian teacher

-- Insert sample skill verifications (verified skills for matching)
INSERT INTO skill_verifications (user_firebase_uid, skill_id, verified, verification_score, verified_at) VALUES
-- Programming teachers with verified skills
('user_programmer_1', (SELECT id FROM skills WHERE name = 'JavaScript'), true, 95.5, CURRENT_TIMESTAMP),
('user_programmer_1', (SELECT id FROM skills WHERE name = 'React'), true, 92.0, CURRENT_TIMESTAMP),
('user_programmer_1', (SELECT id FROM skills WHERE name = 'Node.js'), true, 88.5, CURRENT_TIMESTAMP),
('user_programmer_3', (SELECT id FROM skills WHERE name = 'Java'), true, 96.0, CURRENT_TIMESTAMP),
('user_programmer_3', (SELECT id FROM skills WHERE name = 'C++'), true, 94.5, CURRENT_TIMESTAMP),
('user_programmer_3', (SELECT id FROM skills WHERE name = 'SQL'), true, 91.0, CURRENT_TIMESTAMP),

-- Language teachers with verified skills
('user_language_1', (SELECT id FROM skills WHERE name = 'Spanish'), true, 98.0, CURRENT_TIMESTAMP),
('user_language_2', (SELECT id FROM skills WHERE name = 'Japanese'), true, 97.5, CURRENT_TIMESTAMP),
('user_language_4', (SELECT id FROM skills WHERE name = 'German'), true, 96.5, CURRENT_TIMESTAMP),
('user_multi_4', (SELECT id FROM skills WHERE name = 'English'), true, 95.0, CURRENT_TIMESTAMP),

-- Music teachers with verified skills
('user_music_1', (SELECT id FROM skills WHERE name = 'Piano'), true, 97.0, CURRENT_TIMESTAMP),
('user_music_1', (SELECT id FROM skills WHERE name = 'Music Theory'), true, 94.5, CURRENT_TIMESTAMP),
('user_music_1', (SELECT id FROM skills WHERE name = 'Jazz'), true, 93.0, CURRENT_TIMESTAMP),
('user_music_2', (SELECT id FROM skills WHERE name = 'Violin'), true, 96.5, CURRENT_TIMESTAMP),
('user_music_2', (SELECT id FROM skills WHERE name = 'Classical'), true, 95.0, CURRENT_TIMESTAMP),

-- Multi-skilled teachers with verified skills
('user_multi_1', (SELECT id FROM skills WHERE name = 'JavaScript'), true, 92.5, CURRENT_TIMESTAMP),
('user_multi_1', (SELECT id FROM skills WHERE name = 'Portuguese'), true, 98.0, CURRENT_TIMESTAMP),
('user_multi_1', (SELECT id FROM skills WHERE name = 'Guitar'), true, 90.5, CURRENT_TIMESTAMP),
('user_multi_4', (SELECT id FROM skills WHERE name = 'Piano'), true, 93.5, CURRENT_TIMESTAMP),
('user_multi_4', (SELECT id FROM skills WHERE name = 'Italian'), true, 97.0, CURRENT_TIMESTAMP),

-- New skill-specific teachers with verified skills
-- Programming Skills
('teacher_aws', (SELECT id FROM skills WHERE name = 'AWS'), true, 96.0, CURRENT_TIMESTAMP),
('teacher_cpp', (SELECT id FROM skills WHERE name = 'C++'), true, 97.5, CURRENT_TIMESTAMP),
('teacher_docker', (SELECT id FROM skills WHERE name = 'Docker'), true, 94.0, CURRENT_TIMESTAMP),
('teacher_git', (SELECT id FROM skills WHERE name = 'Git'), true, 95.5, CURRENT_TIMESTAMP),

-- Language Skills
('teacher_arabic', (SELECT id FROM skills WHERE name = 'Arabic'), true, 98.5, CURRENT_TIMESTAMP),
('teacher_mandarin', (SELECT id FROM skills WHERE name = 'Mandarin'), true, 97.0, CURRENT_TIMESTAMP),
('teacher_russian', (SELECT id FROM skills WHERE name = 'Russian'), true, 96.5, CURRENT_TIMESTAMP),

-- Music Skills
('teacher_drums', (SELECT id FROM skills WHERE name = 'Drums'), true, 95.0, CURRENT_TIMESTAMP),
('teacher_singing', (SELECT id FROM skills WHERE name = 'Singing'), true, 96.5, CURRENT_TIMESTAMP),
('teacher_composition', (SELECT id FROM skills WHERE name = 'Composition'), true, 94.5, CURRENT_TIMESTAMP),
('teacher_rock', (SELECT id FROM skills WHERE name = 'Rock'), true, 93.0, CURRENT_TIMESTAMP),

-- Other Skills
('teacher_cooking', (SELECT id FROM skills WHERE name = 'Cooking'), true, 95.5, CURRENT_TIMESTAMP),
('teacher_photography', (SELECT id FROM skills WHERE name = 'Photography'), true, 94.0, CURRENT_TIMESTAMP),
('teacher_drawing', (SELECT id FROM skills WHERE name = 'Drawing'), true, 92.5, CURRENT_TIMESTAMP),
('teacher_meditation', (SELECT id FROM skills WHERE name = 'Meditation'), true, 96.0, CURRENT_TIMESTAMP),
('teacher_chess', (SELECT id FROM skills WHERE name = 'Chess'), true, 97.5, CURRENT_TIMESTAMP),
('teacher_public_speaking', (SELECT id FROM skills WHERE name = 'Public Speaking'), true, 95.0, CURRENT_TIMESTAMP),
('teacher_creative_writing', (SELECT id FROM skills WHERE name = 'Creative Writing'), true, 93.5, CURRENT_TIMESTAMP);
