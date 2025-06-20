const { Configuration, OpenAIApi } = require('openai');
const config = require('../config');
const NodeCache = require('node-cache');

// Create cache with 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600 });

// Initialize OpenAI configuration
const configuration = new Configuration({
  apiKey: config.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Generate content ideas using OpenAI
 * @param {Object} params - Parameters for idea generation
 * @param {string} params.contentType - Type of content (blog, video, social)
 * @param {string} params.industry - Industry or niche
 * @param {string} params.audience - Target audience
 * @param {string} params.tone - Tone of content
 * @param {number} params.count - Number of ideas to generate
 * @returns {Promise<Array>} - Array of generated ideas
 */
const generateContentIdeas = async ({ contentType, industry, audience, tone, count }) => {
  try {
    // Create cache key
    const cacheKey = `${contentType}-${industry}-${audience}-${tone}-${count}`;
    
    // Check if result is in cache
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    
    // Construct prompt
    const prompt = `Generate ${count} creative ${contentType} content ideas for a ${industry} business targeting ${audience} with a ${tone} tone.

For each idea, provide:
1. An engaging title
2. A brief description (2-3 sentences)
3. 3-5 relevant keywords
4. Target audience specifics
5. Estimated engagement potential (high, medium, or low)

Format each idea as a JSON object with the following properties: title, description, keywords (array), targetAudience, estimatedEngagement.`;

    // Call OpenAI API
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt,
      max_tokens: 1500,
      temperature: 0.7,
      n: 1,
    });

    // Process response
    const responseText = response.data.choices[0].text.trim();
    let ideas = [];
    
    try {
      // Attempt to parse as JSON array directly
      ideas = JSON.parse(responseText);
    } catch (parseError) {
      // If direct parsing fails, try to extract JSON objects
      try {
        // Look for objects in the format and extract them
        const pattern = /{[^{}]*"title"[^{}]*"description"[^{}]*"keywords"[^{}]*"targetAudience"[^{}]*"estimatedEngagement"[^{}]*}/g;
        const matches = responseText.match(pattern);
        
        if (matches && matches.length > 0) {
          ideas = matches.map(match => JSON.parse(match));
        } else {
          // Fallback: create structured response from raw text
          ideas = parseRawTextToIdeas(responseText);
        }
      } catch (extractError) {
        // Last resort: create structured response from raw text
        ideas = parseRawTextToIdeas(responseText);
      }
    }
    
    // Cache the result
    cache.set(cacheKey, ideas);
    
    return ideas;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate content ideas');
  }
};

/**
 * Parse raw text response into structured ideas
 * @param {string} text - Raw text from API
 * @returns {Array} - Structured ideas
 */
const parseRawTextToIdeas = (text) => {
  // Split text into idea blocks
  const ideaBlocks = text.split(/\n\s*\n/);
  
  return ideaBlocks.map(block => {
    // Extract title from the first line
    const titleMatch = block.match(/^(?:\d+\.\s*)?(.+?)$/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled Idea';
    
    // Extract description
    const descMatch = block.match(/description:?\s*(.+?)(?=\n|$)/i) || 
                      block.match(/\n(?:\d+\.\s*)?(.+?)(?=\n|$)/);
    const description = descMatch ? descMatch[1].trim() : 'No description provided';
    
    // Extract keywords
    const keywordsMatch = block.match(/keywords:?\s*(.+?)(?=\n|$)/i);
    const keywords = keywordsMatch 
      ? keywordsMatch[1].split(/,\s*/).map(k => k.trim())
      : ['content', 'idea'];
    
    // Extract target audience
    const audienceMatch = block.match(/(?:target\s*)?audience:?\s*(.+?)(?=\n|$)/i);
    const targetAudience = audienceMatch ? audienceMatch[1].trim() : 'General audience';
    
    // Extract engagement potential
    const engagementMatch = block.match(/(?:estimated\s*)?engagement:?\s*(.+?)(?=\n|$)/i);
    const estimatedEngagement = engagementMatch ? engagementMatch[1].trim() : 'Medium';
    
    return {
      title,
      description,
      keywords,
      targetAudience,
      estimatedEngagement
    };
  }).filter(idea => idea.title !== 'Untitled Idea' || idea.description !== 'No description provided');
};

module.exports = {
  generateContentIdeas
};