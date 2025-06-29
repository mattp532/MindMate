const API_BASE_URL = 'http://localhost:8080/api';

class ChatService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      console.log(`Making request to: ${url}`, { 
        method: config.method || 'GET', 
        hasToken: !!this.token,
        body: config.body 
      });
      
      const response = await fetch(url, config);
      
      console.log(`Response status: ${response.status} for ${url}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`API Error for ${url}:`, errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Success response for ${url}:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all users (for matching/discovery)
  async getAllUsers() {
    return this.makeRequest('/chat/users');
  }

  // Get user's matches
  async getUserMatches() {
    return this.makeRequest('/chat/matches');
  }

  // Get messages for a specific match
  async getMatchMessages(matchId) {
    return this.makeRequest(`/chat/matches/${matchId}/messages`);
  }

  // Create a new match
  async createMatch(otherUserId) {
    return this.makeRequest('/chat/matches', {
      method: 'POST',
      body: JSON.stringify({ otherUserId }),
    });
  }

  // Send a message
  async sendMessage(matchId, content) {
    return this.makeRequest(`/chat/matches/${matchId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Get user's conversations (matches with recent messages)
  async getConversations() {
    return this.makeRequest('/chat/conversations');
  }
}

export default new ChatService(); 