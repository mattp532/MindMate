import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const skillsService = {
  // Fetch all available skills from the database
  async getAllSkills() {
    try {
      const response = await axios.get(`${API_BASE_URL}/skills`);
      return response.data;
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  }
}; 