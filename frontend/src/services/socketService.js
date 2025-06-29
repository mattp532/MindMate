import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.messageHandlers = new Map();
    this.typingHandlers = new Map();
    this.onlineStatusHandlers = new Map();
  }

  connect(userId) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io('http://localhost:8080', {
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.io server');
      this.isConnected = true;
      
      // Authenticate the user
      this.socket.emit('authenticate', { userId });
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
      this.isConnected = false;
    });

    // Handle new messages
    this.socket.on('new_message', (data) => {
      const { matchId, message, senderId, timestamp } = data;
      const handlers = this.messageHandlers.get(matchId) || [];
      handlers.forEach(handler => handler({ matchId, message, senderId, timestamp }));
    });

    // Handle typing indicators
    this.socket.on('user_typing', (data) => {
      const { matchId, userId, isTyping } = data;
      const handlers = this.typingHandlers.get(matchId) || [];
      handlers.forEach(handler => handler({ matchId, userId, isTyping }));
    });

    // Handle online/offline status
    this.socket.on('user_online', (data) => {
      const { userId } = data;
      const handlers = this.onlineStatusHandlers.get('online') || [];
      handlers.forEach(handler => handler(userId));
    });

    this.socket.on('user_offline', (data) => {
      const { userId } = data;
      const handlers = this.onlineStatusHandlers.get('offline') || [];
      handlers.forEach(handler => handler(userId));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join a chat room
  joinChat(matchId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_chat', matchId);
    }
  }

  // Leave a chat room
  leaveChat(matchId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_chat', matchId);
    }
  }

  // Send a message
  sendMessage(matchId, message, senderId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', { matchId, message, senderId });
    }
  }

  // Start typing indicator
  startTyping(matchId, userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_start', { matchId, userId });
    }
  }

  // Stop typing indicator
  stopTyping(matchId, userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_stop', { matchId, userId });
    }
  }

  // Subscribe to new messages for a specific match
  onNewMessage(matchId, handler) {
    if (!this.messageHandlers.has(matchId)) {
      this.messageHandlers.set(matchId, []);
    }
    this.messageHandlers.get(matchId).push(handler);
  }

  // Unsubscribe from new messages for a specific match
  offNewMessage(matchId, handler) {
    if (this.messageHandlers.has(matchId)) {
      const handlers = this.messageHandlers.get(matchId);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Subscribe to typing indicators for a specific match
  onTyping(matchId, handler) {
    if (!this.typingHandlers.has(matchId)) {
      this.typingHandlers.set(matchId, []);
    }
    this.typingHandlers.get(matchId).push(handler);
  }

  // Unsubscribe from typing indicators for a specific match
  offTyping(matchId, handler) {
    if (this.typingHandlers.has(matchId)) {
      const handlers = this.typingHandlers.get(matchId);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Subscribe to online status changes
  onOnlineStatus(status, handler) {
    if (!this.onlineStatusHandlers.has(status)) {
      this.onlineStatusHandlers.set(status, []);
    }
    this.onlineStatusHandlers.get(status).push(handler);
  }

  // Unsubscribe from online status changes
  offOnlineStatus(status, handler) {
    if (this.onlineStatusHandlers.has(status)) {
      const handlers = this.onlineStatusHandlers.get(status);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }
}

export default new SocketService(); 