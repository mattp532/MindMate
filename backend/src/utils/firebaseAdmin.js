const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json'); // adjust path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
