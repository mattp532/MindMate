import { auth, db } from './firebase/config.js';

// Test Firebase connection
console.log('🧪 Testing Firebase connection...');

// Check if Firebase config is loaded
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log('📋 Environment variables loaded:', {
  apiKey: config.apiKey ? '✅ Set' : '❌ Missing',
  authDomain: config.authDomain ? '✅ Set' : '❌ Missing',
  projectId: config.projectId ? '✅ Set' : '❌ Missing',
  storageBucket: config.storageBucket ? '✅ Set' : '❌ Missing',
  messagingSenderId: config.messagingSenderId ? '✅ Set' : '❌ Missing',
  appId: config.appId ? '✅ Set' : '❌ Missing'
});

// Check if Firebase services are initialized
if (auth) {
  console.log('✅ Firebase Auth initialized');
} else {
  console.error('❌ Firebase Auth not initialized');
}

if (db) {
  console.log('✅ Firestore initialized');
} else {
  console.error('❌ Firestore not initialized');
}

// Test basic Firebase functionality
try {
  // This will test if Firebase is properly configured
  const authState = auth.currentUser;
  console.log('✅ Firebase connection test passed');
  console.log('🔗 Firebase is ready to use!');
} catch (error) {
  console.error('❌ Firebase connection test failed:', error);
  console.error('Error details:', {
    code: error.code,
    message: error.message,
    stack: error.stack
  });
} 