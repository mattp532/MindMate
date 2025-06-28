# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for the MindMate project.

## Prerequisites

- A Google account
- Node.js and npm installed
- Firebase CLI (optional but recommended)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "mindmate-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click "Enable" and save
   - **Google**: Click "Enable", configure OAuth consent screen if needed, and save

## Step 3: Get Your Firebase Configuration

1. In the Firebase console, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to the "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "mindmate-web")
6. Copy the Firebase configuration object

## Step 4: Update Firebase Configuration

1. Open `src/firebase/config.js`
2. Replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Configure Authentication Rules (Optional)

If you plan to use Firestore for user data, you'll need to set up security rules:

1. Go to Firestore Database in the Firebase console
2. Click on "Rules" tab
3. Update the rules to allow authenticated users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the registration page and try creating an account
3. Test the login functionality
4. Verify that Google sign-in works

## Features Included

The Firebase setup includes:

- ✅ **Email/Password Authentication**
- ✅ **Google Sign-In**
- ✅ **User Registration with Display Name**
- ✅ **Protected Routes**
- ✅ **Authentication Context**
- ✅ **Form Validation**
- ✅ **Error Handling**
- ✅ **Loading States**
- ✅ **Automatic Redirects**

## Security Best Practices

1. **Environment Variables**: Store your Firebase config in environment variables for production
2. **Domain Restrictions**: Configure authorized domains in Firebase console
3. **Password Requirements**: Firebase handles password strength validation
4. **Rate Limiting**: Firebase provides built-in rate limiting

## Environment Variables (Production)

For production, create a `.env` file in the frontend directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Then update `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## Troubleshooting

### Common Issues:

1. **"Firebase App named '[DEFAULT]' already exists"**
   - This usually happens in development with hot reloading
   - The error is handled gracefully in the current setup

2. **Google Sign-In not working**
   - Make sure Google provider is enabled in Firebase console
   - Check that your domain is authorized

3. **Authentication state not persisting**
   - Firebase handles this automatically
   - Check browser console for any errors

4. **CORS errors**
   - Add your domain to authorized domains in Firebase console

## Additional Features to Consider

- Password reset functionality
- Email verification
- Phone number authentication
- Social media login (Facebook, Twitter, etc.)
- User profile management
- Role-based access control

## Support

If you encounter any issues:

1. Check the Firebase console for error logs
2. Review the browser console for JavaScript errors
3. Verify your Firebase configuration is correct
4. Ensure all required providers are enabled

## Next Steps

After setting up authentication, you might want to:

1. Add user profile management
2. Implement role-based access control
3. Set up Firestore for user data storage
4. Add real-time features with Firebase Realtime Database
5. Implement push notifications with Firebase Cloud Messaging 