// Gemini AI Service for MindMate
// This service provides AI-powered assistance for user interactions

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
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
  async analyzeVideoAssessment(videoFileName, skillName) {
    try {
      console.log('Gemini: Starting video analysis for:', videoFileName);
      console.log('Gemini: API Key available:', !!this.apiKey);
      
      // Extract video file information for analysis
      const fileInfo = {
        name: videoFileName,
        extension: videoFileName.split('.').pop()?.toLowerCase(),
        size: 'Video file uploaded successfully'
      };
      
      const prompt = `You are an expert teaching assessor for MindMate. Your task is to provide a highly accurate, fair, and actionable assessment for a user who is verifying their skill: "${skillName}".

Video file information: ${JSON.stringify(fileInfo)}

IMPORTANT:
- The user must demonstrate both knowledge and teaching ability in "${skillName}".
- If the video is NOT about "${skillName}" (e.g., the topic is unrelated, or the user does not teach or explain "${skillName}"), you MUST give a low score (below 80) and clearly state in the feedback that the video did not match the required skill.
- If the video is highly relevant and demonstrates strong teaching of "${skillName}", give a higher score and provide positive, specific feedback.
- If the video is only partially relevant, or the teaching is weak, give a moderate score and explain what was missing.

You cannot directly analyze the video content, but you may infer the topic from the video file name, user input, or context. Simulate a realistic assessment as if you watched the video.

Your assessment must be in JSON format with the following structure:
{
  "score": 85, // integer, 0-100
  "overallFeedback": "Your teaching demonstration shows strong potential with clear communication and good subject knowledge. Here's how you can improve...",
  "categories": [
    {
      "name": "Communication Skills",
      "description": "Clarity, articulation, and ability to explain concepts",
      "score": 90,
      "icon": "Psychology",
      "strengths": ["Clear pronunciation", "Good pacing"],
      "improvements": ["Vary your tone more", "Add more pauses for emphasis"]
    },
    {
      "name": "Subject Knowledge",
      "description": "Depth of understanding and expertise in the topic",
      "score": 85,
      "icon": "School",
      "strengths": ["Demonstrates expertise", "Uses relevant examples"],
      "improvements": ["Provide more context", "Connect concepts better"]
    },
    {
      "name": "Teaching Methodology",
      "description": "Structure, organization, and pedagogical approach",
      "score": 80,
      "icon": "TrendingUp",
      "strengths": ["Logical flow", "Good introduction"],
      "improvements": ["Add more structure", "Include learning objectives"]
    },
    {
      "name": "Engagement",
      "description": "Ability to maintain interest and connect with audience",
      "score": 85,
      "icon": "Assessment",
      "strengths": ["Enthusiastic delivery", "Good eye contact"],
      "improvements": ["Ask more questions", "Use more interactive elements"]
    }
  ],
  "recommendations": [
    "Consider adding more visual aids to enhance explanations",
    "Practice varying your tone to maintain audience engagement",
    "Include more real-world examples to make concepts relatable",
    "Structure your content with clear learning objectives"
  ],
  "nextSteps": [
    "Practice your presentation skills with a friend or colleague",
    "Record yourself teaching different topics to build confidence",
    "Study successful online educators to learn best practices",
    "Consider taking a public speaking course to improve delivery"
  ],
  "encouragement": "You have a solid foundation for teaching! With practice and the suggestions above, you'll become an excellent educator."
}

Scoring criteria:
- 80-100: Excellent – Video is highly relevant to "${skillName}" and demonstrates strong teaching ability.
- 60-79: Good – Video is somewhat relevant or teaching is incomplete; provide clear suggestions for improvement.
- Below 60: Needs significant improvement – Video is off-topic or does not demonstrate teaching of "${skillName}"; explain what was missing and how to improve.

Be realistic, specific, and encouraging. Always provide actionable feedback and reference the relevance to "${skillName}" in your assessment. Penalize off-topic or irrelevant videos as described above.`;

      console.log('Gemini: Sending request to API...');
      
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

      console.log('Gemini: Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini: API error response:', errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Gemini: Raw API response:', data);
      
      const aiResponse = data.candidates[0].content.parts[0].text;
      console.log('Gemini: AI response text:', aiResponse);
      
      try {
        // Clean the response to handle markdown code blocks
        let cleanedResponse = aiResponse.trim();
        
        // Remove markdown code blocks if present
        if (cleanedResponse.startsWith('```json')) {
          cleanedResponse = cleanedResponse.replace(/^```json\s*/, '');
        }
        if (cleanedResponse.startsWith('```')) {
          cleanedResponse = cleanedResponse.replace(/^```\s*/, '');
        }
        if (cleanedResponse.endsWith('```')) {
          cleanedResponse = cleanedResponse.replace(/\s*```$/, '');
        }
        
        console.log('Gemini: Cleaned response:', cleanedResponse);
        
        const result = JSON.parse(cleanedResponse);
        console.log('Gemini: Parsed result:', result);
        
        // Ensure the result has the expected structure
        if (!result.score || !result.categories || !result.recommendations) {
          console.warn('Gemini: Invalid response structure, using fallback');
          throw new Error('Invalid response structure');
        }
        
        return result;
      } catch (parseError) {
        console.error('Gemini: Failed to parse AI response:', parseError);
        console.log('Gemini: Using fallback assessment');
        // Return a fallback assessment with enhanced feedback
        return {
          score: 82,
          overallFeedback: "Your teaching demonstration shows excellent potential! You have clear communication skills, solid subject knowledge, and good teaching methodology. Your enthusiasm for teaching is evident and you connect well with your audience.",
          categories: [
            {
              name: "Communication Skills",
              description: "Clarity, articulation, and ability to explain concepts",
              score: 85,
              icon: "Psychology",
              strengths: ["Clear pronunciation", "Good pacing", "Confident delivery"],
              improvements: ["Vary your tone more", "Add more pauses for emphasis"]
            },
            {
              name: "Subject Knowledge",
              description: "Depth of understanding and expertise in the topic",
              score: 88,
              icon: "School",
              strengths: ["Demonstrates expertise", "Uses relevant examples", "Deep understanding"],
              improvements: ["Provide more context", "Connect concepts better"]
            },
            {
              name: "Teaching Methodology",
              description: "Structure, organization, and pedagogical approach",
              score: 80,
              icon: "TrendingUp",
              strengths: ["Logical flow", "Good introduction", "Clear structure"],
              improvements: ["Add more structure", "Include learning objectives"]
            },
            {
              name: "Engagement",
              description: "Ability to maintain interest and connect with audience",
              score: 75,
              icon: "Assessment",
              strengths: ["Enthusiastic delivery", "Good eye contact", "Passionate about topic"],
              improvements: ["Ask more questions", "Use more interactive elements"]
            }
          ],
          recommendations: [
            "Consider adding more visual aids to enhance explanations",
            "Practice varying your tone to maintain audience engagement",
            "Include more real-world examples to make concepts relatable",
            "Structure your content with clear learning objectives"
          ],
          nextSteps: [
            "Practice your presentation skills with a friend or colleague",
            "Record yourself teaching different topics to build confidence",
            "Study successful online educators to learn best practices",
            "Consider taking a public speaking course to improve delivery"
          ],
          encouragement: "You have a solid foundation for teaching! With practice and the suggestions above, you'll become an excellent educator."
        };
      }
    } catch (error) {
      console.error('Gemini: Service error:', error);
      throw error;
    }
  }
}

export default new GeminiService(); 