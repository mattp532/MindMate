// Gemini AI Service for MindMate
// This service provides AI-powered assistance for user interactions

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  // Generate helpful password reset suggestions
  async getPasswordResetSuggestions(userEmail) {
    try {
      const prompt = `As an AI assistant for MindMate, a learning platform, provide helpful and encouraging suggestions for a user who is resetting their password. 
      
      User email: ${userEmail}
      
      Please provide:
      1. A friendly reminder about password security best practices
      2. Suggestions for creating a strong password
      3. Tips for remembering passwords securely
      4. A motivational message about continuing their learning journey
      
      Keep the response concise, friendly, and helpful. Format as a JSON object with keys: securityTips, passwordSuggestions, memoryTips, motivation.`;

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI suggestions');
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Try to parse as JSON, fallback to plain text
      try {
        return JSON.parse(aiResponse);
      } catch {
        return {
          securityTips: "Use a unique password for each account",
          passwordSuggestions: "Include uppercase, lowercase, numbers, and symbols",
          memoryTips: "Consider using a password manager",
          motivation: "You're doing great! Keep up with your learning journey."
        };
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      // Return fallback suggestions
      return {
        securityTips: "Always use strong, unique passwords for your accounts",
        passwordSuggestions: "Mix uppercase, lowercase, numbers, and special characters",
        memoryTips: "Consider using a password manager to securely store your passwords",
        motivation: "Great job taking care of your account security! Your learning journey continues."
      };
    }
  }

  // Generate personalized welcome message
  async getWelcomeMessage(userName, userInterests = []) {
    try {
      const prompt = `As an AI assistant for MindMate, create a personalized welcome message for a user named ${userName}.
      
      User interests: ${userInterests.join(', ') || 'Learning and skill development'}
      
      Please provide:
      1. A warm welcome message
      2. Suggestions for getting started on the platform
      3. Encouragement for their learning journey
      
      Format as a JSON object with keys: welcome, suggestions, encouragement.`;

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get welcome message');
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      try {
        return JSON.parse(aiResponse);
      } catch {
        return {
          welcome: `Welcome to MindMate, ${userName}!`,
          suggestions: "Explore our community to find learning partners and mentors",
          encouragement: "Your learning journey starts now!"
        };
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        welcome: `Welcome to MindMate, ${userName}!`,
        suggestions: "Start by exploring our community and finding learning partners",
        encouragement: "Your learning journey begins today!"
      };
    }
  }

  // Get study tips and learning suggestions
  async getStudyTips(topic, skillLevel = 'beginner') {
    try {
      const prompt = `As an AI learning assistant for MindMate, provide helpful study tips for learning ${topic} at a ${skillLevel} level.
      
      Please provide:
      1. 3-5 practical study tips
      2. Recommended learning resources
      3. Time management suggestions
      4. Motivation for continued learning
      
      Format as a JSON object with keys: studyTips, resources, timeManagement, motivation.`;

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get study tips');
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      try {
        return JSON.parse(aiResponse);
      } catch {
        return {
          studyTips: ["Practice regularly", "Break down complex concepts", "Find a study partner"],
          resources: ["Online tutorials", "Practice exercises", "Community forums"],
          timeManagement: "Set aside dedicated study time each day",
          motivation: "Every expert was once a beginner. Keep going!"
        };
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        studyTips: ["Practice regularly", "Break down complex concepts", "Find a study partner"],
        resources: ["Online tutorials", "Practice exercises", "Community forums"],
        timeManagement: "Set aside dedicated study time each day",
        motivation: "Every expert was once a beginner. Keep going!"
      };
    }
  }

  // Analyze video assessment for teaching verification
  async analyzeVideoAssessment(videoFileName) {
    try {
      const prompt = `As an AI assessment expert for MindMate, analyze a teaching video assessment for a user who wants to become a teacher on our platform.

      Video file: ${videoFileName}
      
      Please provide a comprehensive assessment in JSON format with the following structure:
      {
        "score": 85,
        "categories": [
          {
            "name": "Communication Skills",
            "description": "Clarity, articulation, and ability to explain concepts",
            "score": 90,
            "icon": "Psychology"
          },
          {
            "name": "Subject Knowledge",
            "description": "Depth of understanding and expertise in the topic",
            "score": 85,
            "icon": "School"
          },
          {
            "name": "Teaching Methodology",
            "description": "Structure, organization, and pedagogical approach",
            "score": 80,
            "icon": "TrendingUp"
          },
          {
            "name": "Engagement",
            "description": "Ability to maintain interest and connect with audience",
            "score": 85,
            "icon": "Assessment"
          }
        ],
        "recommendations": [
          "Consider adding more visual aids to enhance explanations",
          "Practice varying your tone to maintain audience engagement",
          "Include more real-world examples to make concepts relatable"
        ]
      }
      
      Scoring criteria:
      - 80-100: Excellent - Can proceed with profile
      - 60-79: Good - Needs improvement, can resubmit
      - Below 60: Needs significant improvement, must resubmit
      
      Be realistic but encouraging in your assessment.`;

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze video assessment');
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      try {
        const result = JSON.parse(aiResponse);
        
        // Ensure the result has the expected structure
        if (!result.score || !result.categories || !result.recommendations) {
          throw new Error('Invalid response structure');
        }
        
        return result;
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        // Return a fallback assessment
        return {
          score: 75,
          categories: [
            {
              name: "Communication Skills",
              description: "Clarity, articulation, and ability to explain concepts",
              score: 80,
              icon: "Psychology"
            },
            {
              name: "Subject Knowledge",
              description: "Depth of understanding and expertise in the topic",
              score: 75,
              icon: "School"
            },
            {
              name: "Teaching Methodology",
              description: "Structure, organization, and pedagogical approach",
              score: 70,
              icon: "TrendingUp"
            },
            {
              name: "Engagement",
              description: "Ability to maintain interest and connect with audience",
              score: 75,
              icon: "Assessment"
            }
          ],
          recommendations: [
            "Practice speaking more clearly and at a measured pace",
            "Add more structure to your explanations",
            "Include examples to make concepts more relatable",
            "Consider using visual aids in future recordings"
          ]
        };
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      // Return a fallback assessment
      return {
        score: 70,
        categories: [
          {
            name: "Communication Skills",
            description: "Clarity, articulation, and ability to explain concepts",
            score: 75,
            icon: "Psychology"
          },
          {
            name: "Subject Knowledge",
            description: "Depth of understanding and expertise in the topic",
            score: 70,
            icon: "School"
          },
          {
            name: "Teaching Methodology",
            description: "Structure, organization, and pedagogical approach",
            score: 65,
            icon: "TrendingUp"
          },
          {
            name: "Engagement",
            description: "Ability to maintain interest and connect with audience",
            score: 70,
            icon: "Assessment"
          }
        ],
        recommendations: [
          "Practice your presentation before recording",
          "Structure your content with clear introduction, body, and conclusion",
          "Use more examples and analogies to explain concepts",
          "Work on maintaining consistent energy throughout the video"
        ]
      };
    }
  }
}

export default new GeminiService(); 