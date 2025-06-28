# Environment Setup Guide

This guide will help you set up the environment variables for MindMate with Firebase Authentication and Gemini AI integration.

## Prerequisites

- Firebase project with Authentication enabled
- Google AI Studio account for Gemini API access
- Node.js and npm installed

## Step 1: Firebase Setup

1. **Create a Firebase Project** (if not already done):
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable Authentication with Email/Password and Google providers

2. **Get Firebase Configuration**:
   - In Firebase console, go to Project Settings
   - Scroll to "Your apps" section
   - Click the web icon (</>)
   - Register your app and copy the configuration

3. **Copy Firebase Config Template**:
   ```bash
   cp src/firebase/config.template.js src/firebase/config.js
   ```

## Step 2: Gemini AI Setup

1. **Get Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the API key

## Step 3: Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your-gemini-api-key
```

## Step 4: Update Firebase Config

Update `src/firebase/config.js` to use environment variables:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

## Step 5: Test the Setup

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test Authentication**:
   - Navigate to `/register` to create an account
   - Navigate to `/login` to sign in
   - Test Google sign-in
   - Test forgot password functionality

3. **Test Gemini AI Integration**:
   - Go to forgot password page
   - Enter an email and submit
   - Check if AI suggestions appear

## Features Enabled

With this setup, you'll have access to:

### Authentication Features:
- ✅ Email/Password registration and login
- ✅ Google sign-in
- ✅ Password reset functionality
- ✅ Protected routes
- ✅ User session management

### AI-Powered Features:
- ✅ Password reset suggestions
- ✅ Security tips and best practices
- ✅ Personalized learning recommendations
- ✅ Study tips and motivation

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Keep your API keys secure and rotate them regularly
- Use environment variables for all sensitive configuration

## Troubleshooting

### Common Issues:

1. **"Firebase App named '[DEFAULT]' already exists"**
   - This is normal in development with hot reloading
   - The error is handled gracefully

2. **Gemini API errors**
   - Check if your API key is correct
   - Verify you have sufficient quota
   - Check network connectivity

3. **Environment variables not loading**
   - Restart the development server after creating `.env`
   - Check that variable names start with `VITE_`
   - Verify the `.env` file is in the frontend directory

4. **Authentication not working**
   - Verify Firebase configuration is correct
   - Check that Authentication is enabled in Firebase console
   - Ensure authorized domains are configured

## Next Steps

After setup, you can:

1. Customize the AI prompts in `src/services/geminiService.js`
2. Add more AI-powered features
3. Implement additional authentication providers
4. Add user profile management
5. Integrate with the backend API

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Test with a fresh `.env` file
4. Check Firebase and Gemini API quotas
5. Review the authentication setup in Firebase console 