import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Debug environment variables
console.log('Firebase Config Debug:');
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? 'Present' : 'Missing');
console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

// Your Firebase configuration
// Using environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log('Final Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'Present' : 'Missing',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId ? 'Present' : 'Missing',
  measurementId: firebaseConfig.measurementId
});

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase app:', error);
  throw error;
}

// Initialize Firebase Authentication and get a reference to the service
let auth;
try {
  auth = getAuth(app);
  console.log('✅ Firebase Auth initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase Auth:', error);
  throw error;
}

// Initialize Cloud Firestore and get a reference to the service
let db;
try {
  db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firestore:', error);
  throw error;
}

export { auth, db };
export default app; 