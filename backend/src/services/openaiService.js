const { Configuration, OpenAIApi } = require('openai');
const config = require('../config/config');

// Initialize OpenAI configuration
const configuration = new Configuration({
  apiKey: config.openai.apiKey,
});

const openai = new OpenAIApi(configuration);

/**
 * Generate content ideas using OpenAI
 * @param {string} prompt - The prompt to send to OpenAI
 * @param {number} count - Number of ideas to generate
 * @returns {Array} - Array of generated ideas
 */
const generateContentIdeas = async (prompt, count = 3) => {
  try {
    const response = await openai.createChatCompletion({
      model: config.openai.model || 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a creative content strategist who generates innovative content ideas.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 1500,
      top_p: 1,
      frequency_penalty: 0.3,
      presence_penalty: 0.2,
    });

    // Extract the response text
    const responseText = response.data.choices[0].message.content.trim();
    
    // Parse JSON from the response
    // OpenAI sometimes returns ideas in various formats, so we need to handle different cases
    try {
      // Try parsing directly if the entire response is a JSON array
      if (responseText.startsWith('[') && responseText.endsWith(']')) {
        return JSON.parse(responseText);
      }
      
      // If the response has JSON objects but not in an array format
      if (responseText.includes('{') && responseText.includes('}')) {
        // Extract all JSON objects using regex
        const jsonRegex = /{[^{}]*(?:{[^{}]*}[^{}]*)*}/g;
        const matches = responseText.match(jsonRegex);
        
        if (matches && matches.length > 0) {
          return matches.map(jsonStr => JSON.parse(jsonStr));
        }
      }
      
      // If we couldn't parse JSON, fallback to returning structured text
      return parseUnstructuredResponse(responseText, count);
      
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      // Fallback to returning structured text
      return parseUnstructuredResponse(responseText, count);
    }
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    throw new Error('Failed to generate ideas with AI. Please try again later.');
  }
};

/**
 * Parse unstructured response text into structured idea objects
 * @param {string} text - The text response from OpenAI
 * @param {number} count - Expected number of ideas
 * @returns {Array} - Structured array of idea objects
 */
const parseUnstructuredResponse = (text, count) => {
  // Default structure for ideas
  const defaultIdeas = Array(count).fill().map((_, i) => ({
    title: `Content Idea ${i + 1}`,
    description: 'No description available. Please try generating ideas again.',
    keywords: ['content', 'idea'],
    targetAudience: 'General audience',
    estimatedEngagement: 'medium',
    contentType: 'blog'
  }));
  
  // Try to extract structured information from the text
  const ideas = [];
  
  // Split by numbered items (1., 2., etc.) or by idea titles
  const ideaSections = text.split(/\n\s*(?:\d+\.|\#|\*|\-|\bIdea\s+\d+\b:)/g).filter(Boolean);
  
  for (let i = 0; i < Math.min(ideaSections.length, count); i++) {
    const section = ideaSections[i].trim();
    
    // Extract title
    let title = section.split('\n')[0].replace(/^[:#\s]+/, '').trim();
    if (!title || title.length > 100) {
      title = section.match(/(?:Title|Idea):\s*([^\n]+)/i)?.[1]?.trim() || `Content Idea ${i + 1}`;
    }
    
    // Extract description
    const descriptionMatch = section.match(/(?:Description|Summary):\s*([^\n]+(?:\n[^\n]+)*)/i);
    const description = descriptionMatch?.[1]?.trim() || section.split('\n').slice(1, 3).join(' ').trim();
    
    // Extract keywords
    const keywordsMatch = section.match(/(?:Keywords|Tags):\s*([^\n]+)/i);
    const keywordsText = keywordsMatch?.[1] || '';
    const keywords = keywordsText.split(/[,;|]+/).map(k => k.trim()).filter(Boolean);
    
    // Extract target audience
    const audienceMatch = section.match(/(?:Target\s+Audience|Audience):\s*([^\n]+)/i);
    const targetAudience = audienceMatch?.[1]?.trim() || 'General audience';
    
    // Extract engagement potential
    const engagementMatch = section.match(/(?:Engagement|Engagement\s+Potential):\s*([^\n]+)/i);
    let estimatedEngagement = engagementMatch?.[1]?.trim().toLowerCase() || 'medium';
    
    // Normalize engagement values
    if (estimatedEngagement.includes('high')) estimatedEngagement = 'high';
    else if (estimatedEngagement.includes('low')) estimatedEngagement = 'low';
    else estimatedEngagement = 'medium';
    
    ideas.push({
      title,
      description,
      keywords: keywords.length > 0 ? keywords : ['content', 'idea'],
      targetAudience,
      estimatedEngagement,
      contentType: 'blog' // Default content type
    });
  }
  
  // If we couldn't extract any structured ideas, return the default ones
  return ideas.length > 0 ? ideas : defaultIdeas.slice(0, count);
};

module.exports = {
  generateContentIdeas,
};