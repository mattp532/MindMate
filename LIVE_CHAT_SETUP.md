# Live Chat Setup Guide

This guide will help you set up and test the live interactive chat functionality with real users from the database.

## 🚀 Quick Start

### 1. Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Make sure your `.env` file in the backend directory includes:
   ```env
   PG_USER=your_postgres_user
   PG_HOST=localhost
   PG_DB=your_database_name
   PG_PASSWORD=your_postgres_password
   PG_PORT=5432
   PORT=8080
   ```

3. **Database Setup**
   - Ensure PostgreSQL is running
   - The database tables should already be created from `initdb/initdb.sql`
   - Make sure you have some users in the database

4. **Start Backend Server**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:8080`

### 2. Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Frontend Development Server**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

## 🧪 Testing the Live Chat

### Step 1: Create Multiple User Accounts

1. **Open two different browser windows/incognito tabs**
2. **Register two different user accounts:**
   - User 1: `user1@example.com` / `password123`
   - User 2: `user2@example.com` / `password123`

### Step 2: Test User Discovery

1. **Login as User 1**
2. **Navigate to the Chat page**
3. **Click on the "Discover" tab**
4. **You should see User 2 in the list**
5. **Click on User 2's card to view their profile**
6. **Click "Start Match" to create a conversation**

### Step 3: Test Real-time Messaging

1. **In the first browser (User 1):**
   - Go to the "Conversations" tab
   - Click on the conversation with User 2
   - Type a message and send it

2. **In the second browser (User 2):**
   - Login as User 2
   - Go to the Chat page
   - You should see the conversation with User 1
   - Click on it to see the message
   - Reply to the message

3. **Real-time Features to Test:**
   - ✅ Messages appear instantly in both browsers
   - ✅ Typing indicators ("typing..." appears when someone is typing)
   - ✅ Online/offline status
   - ✅ Message timestamps
   - ✅ Unread message counts

## 🔧 Key Features Implemented

### Backend Features
- ✅ **RESTful API endpoints** for chat functionality
- ✅ **Socket.io integration** for real-time communication
- ✅ **User authentication** with Firebase
- ✅ **Database integration** with PostgreSQL
- ✅ **Match creation** between users
- ✅ **Message persistence** in database
- ✅ **Conversation management**

### Frontend Features
- ✅ **Real-time messaging** with Socket.io client
- ✅ **User discovery** interface
- ✅ **Conversation list** with latest messages
- ✅ **Typing indicators**
- ✅ **Online/offline status**
- ✅ **Unread message counts**
- ✅ **Responsive design** for mobile and desktop
- ✅ **Modern UI** with Material-UI components

## 📁 File Structure

```
backend/
├── src/
│   ├── routes/chatRoutes.js          # Chat API routes
│   ├── controllers/chatController.js  # Chat business logic
│   ├── services/chatService.js        # Database operations
│   └── server.js                      # Socket.io integration

frontend/
├── src/
│   ├── services/
│   │   ├── chatService.js             # API calls to backend
│   │   └── socketService.js           # Socket.io client
│   ├── components/
│   │   └── UserDiscovery.jsx          # User discovery interface
│   └── pages/
│       └── Chat.jsx                   # Main chat interface
```

## 🐛 Troubleshooting

### Common Issues

1. **Socket.io Connection Failed**
   - Check if backend is running on port 8080
   - Ensure CORS is properly configured
   - Check browser console for connection errors

2. **Messages Not Appearing**
   - Verify user authentication
   - Check if users are properly matched
   - Ensure database connection is working

3. **Users Not Showing in Discovery**
   - Make sure users are registered in the database
   - Check if authentication tokens are valid
   - Verify API endpoints are working

### Debug Commands

```bash
# Check backend logs
cd backend && npm run dev

# Check frontend console
# Open browser dev tools and check console for errors

# Test API endpoints
curl http://localhost:8080/api/chat/users
```

## 🎯 Next Steps

Once the basic chat is working, you can enhance it with:

1. **File Attachments** - Upload and share files
2. **Voice Messages** - Record and send audio
3. **Video Calls** - Integrate WebRTC for video calls
4. **Message Reactions** - Add emoji reactions to messages
5. **Message Search** - Search through conversation history
6. **Push Notifications** - Notify users of new messages
7. **Message Encryption** - End-to-end encryption for privacy

## 📞 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify all dependencies are installed
3. Ensure database is running and accessible
4. Check that both frontend and backend servers are running
5. Verify environment variables are correctly set

The live chat system is now ready for testing! 🎉 