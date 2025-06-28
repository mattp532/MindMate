const admin = require('./utils/firebaseAdmin.js');

async function createTestUser() {
  try {
    const userRecord = await admin.auth().createUser({
      email: 'testuser@example.com',
      emailVerified: false,
      password: 'TestPass123!',
      displayName: 'Test User',
      disabled: false,
    });
    console.log('User created:', userRecord.uid);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

createTestUser();
