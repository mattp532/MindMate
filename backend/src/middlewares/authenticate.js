const admin = require('../utils/firebaseAdmin'); 

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log('Auth header received:', authHeader ? 'Present' : 'Missing');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Invalid auth header format');
    return res.status(401).json({ error: 'Missing or invalid authorization token' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token length:', token.length);
  console.log('Token preview:', token.substring(0, 20) + '...');

  try {
    console.log('Attempting to verify Firebase token...');
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token verified successfully for user:', decodedToken.uid);
    
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error('Authentication error details:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return res.status(403).json({ error: 'Unauthorized', details: error.message });
  }
}

module.exports = authenticate;
