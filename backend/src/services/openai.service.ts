import { Configuration, OpenAIApi } from 'openai';
import { logger } from '../utils/logger';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export interface IdeaGenerationParams {
  contentType: 'blog' | 'video' | 'social';
  industry: string;
  audience: string;
  tone: string;
  count: number;
}

export interface GeneratedIdea {
  title: string;
  description: string;
  contentType: 'blog' | 'video' | 'social';
  keywords: string[];
  targetAudience?: string;
  estimatedEngagement?: string;
}

export const generateContentIdeas = async (params: IdeaGenerationParams): Promise<GeneratedIdea[]> => {
  const { contentType, industry, audience, tone, count } = params;

  try {
    // Create a prompt for the OpenAI API
    const prompt = `Generate ${count} creative ${contentType} content ideas for a ${industry} business targeting ${audience} with a ${tone} tone. 

For each idea, provide:
1. An engaging title
2. A brief description (2-3 sentences)
3. 3-5 relevant keywords
4. Target audience specifics
5. Estimated engagement potential (high, medium, or low)

Format each idea as a JSON object with the following properties: title, description, keywords (array), targetAudience, estimatedEngagement. Return all ideas as a JSON array.`;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 2048,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0.2,
    });

    const result = response.data.choices[0].text?.trim();

    if (!result) {
      throw new Error('No ideas generated');
    }

    // Parse the response as JSON
    let ideas: GeneratedIdea[] = [];
    try {
      ideas = JSON.parse(result);
    } catch (error) {
      // If parsing fails, try to extract JSON from the response
      const jsonStart = result.indexOf('[');
      const jsonEnd = result.lastIndexOf(']') + 1;
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const jsonString = result.substring(jsonStart, jsonEnd);
        ideas = JSON.parse(jsonString);
      } else {
        throw new Error('Failed to parse generated ideas');
      }
    }

    // Add contentType to each idea
    return ideas.map(idea => ({
      ...idea,
      contentType,
    }));
  } catch (error: any) {
    logger.error('OpenAI API error:', error);
    throw new Error(`Failed to generate ideas: ${error.message}`);
  }
};
