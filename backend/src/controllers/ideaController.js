const asyncHandler = require('express-async-handler');
const Idea = require('../models/ideaModel');
const openai = require('../services/openaiService');

// @desc    Generate content ideas with OpenAI
// @route   POST /api/ideas/generate
// @access  Private
const generateIdeas = asyncHandler(async (req, res) => {
  const { contentType, industry, audience, tone, count = 3 } = req.body;

  if (!contentType || !industry || !audience || !tone) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  try {
    // Build the prompt for OpenAI
    const prompt = buildGenerationPrompt(contentType, industry, audience, tone, count);
    
    // Call OpenAI service
    const ideas = await openai.generateContentIdeas(prompt, count);
    
    if (!ideas || ideas.length === 0) {
      res.status(500);
      throw new Error('Failed to generate content ideas');
    }

    res.status(200).json({
      success: true,
      data: ideas,
    });
  } catch (error) {
    console.error('Error generating ideas:', error);
    res.status(500);
    throw new Error('Error generating content ideas. Please try again later.');
  }
});

// @desc    Get all ideas for a user
// @route   GET /api/ideas
// @access  Private
const getIdeas = asyncHandler(async (req, res) => {
  const ideas = await Idea.find({ userId: req.user.id }).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: ideas.length,
    data: ideas,
  });
});

// @desc    Get a single idea
// @route   GET /api/ideas/:id
// @access  Private
const getIdea = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  
  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }
  
  // Check if the idea belongs to the user
  if (idea.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to access this idea');
  }
  
  res.status(200).json({
    success: true,
    data: idea,
  });
});

// @desc    Create a new idea
// @route   POST /api/ideas
// @access  Private
const createIdea = asyncHandler(async (req, res) => {
  const { content, isSaved = true, isScheduled = false, scheduledDate = null } = req.body;
  
  if (!content || !content.title || !content.description) {
    res.status(400);
    throw new Error('Please provide idea content with title and description');
  }
  
  const idea = await Idea.create({
    content,
    userId: req.user.id,
    isSaved,
    isScheduled,
    scheduledDate,
  });
  
  res.status(201).json({
    success: true,
    data: idea,
  });
});

// @desc    Update an idea
// @route   PUT /api/ideas/:id
// @access  Private
const updateIdea = asyncHandler(async (req, res) => {
  let idea = await Idea.findById(req.params.id);
  
  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }
  
  // Check if the idea belongs to the user
  if (idea.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this idea');
  }
  
  idea = await Idea.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  
  res.status(200).json({
    success: true,
    data: idea,
  });
});

// @desc    Delete an idea
// @route   DELETE /api/ideas/:id
// @access  Private
const deleteIdea = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  
  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }
  
  // Check if the idea belongs to the user
  if (idea.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this idea');
  }
  
  await idea.remove();
  
  res.status(200).json({
    success: true,
    data: {},
  });
});

// Helper function to build the OpenAI prompt
const buildGenerationPrompt = (contentType, industry, audience, tone, count) => {
  return `Generate ${count} creative ${contentType} content ideas for a ${industry} business targeting ${audience} with a ${tone} tone.

For each idea, provide:
1. An engaging title
2. A brief description (2-3 sentences)
3. 3-5 relevant keywords
4. Target audience specifics
5. Estimated engagement potential (high, medium, or low)

Format each idea as a JSON object with the following properties: title, description, keywords (array), targetAudience, estimatedEngagement.`;
};

module.exports = {
  generateIdeas,
  getIdeas,
  getIdea,
  createIdea,
  updateIdea,
  deleteIdea,
};