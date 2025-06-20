const Idea = require('../models/idea.model');
const openAiService = require('../services/openai.service');
const asyncHandler = require('express-async-handler');

/**
 * Generate content ideas using OpenAI API
 * @route   POST /api/ideas/generate
 * @access  Private
 */
const generateIdeas = asyncHandler(async (req, res) => {
  const { contentType, industry, audience, tone, count } = req.body;

  // Validate required fields
  if (!contentType || !industry) {
    return res.status(400).json({ message: 'Content type and industry are required' });
  }

  try {
    // Generate ideas using OpenAI service
    const generatedIdeas = await openAiService.generateContentIdeas({
      contentType,
      industry,
      audience: audience || 'general audience',
      tone: tone || 'professional',
      count: count || 3
    });

    res.status(200).json({
      success: true,
      data: generatedIdeas,
    });
  } catch (error) {
    console.error('Error generating ideas:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate ideas',
      error: process.env.NODE_ENV === 'development' ? error.message : 'API Error'
    });
  }
});

/**
 * Get all ideas for the authenticated user
 * @route   GET /api/ideas
 * @access  Private
 */
const getUserIdeas = asyncHandler(async (req, res) => {
  // Get ideas for the authenticated user
  const ideas = await Idea.find({ userId: req.user._id })
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: ideas.length,
    data: ideas
  });
});

/**
 * Get a specific idea by ID
 * @route   GET /api/ideas/:id
 * @access  Private
 */
const getIdeaById = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  
  // Check if idea exists
  if (!idea) {
    return res.status(404).json({ message: 'Idea not found' });
  }
  
  // Check if user owns the idea
  if (idea.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to access this idea' });
  }
  
  res.status(200).json({
    success: true,
    data: idea
  });
});

/**
 * Save a new idea
 * @route   POST /api/ideas
 * @access  Private
 */
const saveIdea = asyncHandler(async (req, res) => {
  const { content, isSaved, isScheduled, scheduledDate } = req.body;
  
  // Validate required fields
  if (!content || !content.title || !content.description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }
  
  // Create new idea
  const idea = await Idea.create({
    content,
    userId: req.user._id,
    isSaved: isSaved || true,
    isScheduled: isScheduled || false,
    scheduledDate: scheduledDate || null
  });
  
  res.status(201).json({
    success: true,
    data: idea
  });
});

/**
 * Update an existing idea
 * @route   PUT /api/ideas/:id
 * @access  Private
 */
const updateIdea = asyncHandler(async (req, res) => {
  let idea = await Idea.findById(req.params.id);
  
  // Check if idea exists
  if (!idea) {
    return res.status(404).json({ message: 'Idea not found' });
  }
  
  // Check if user owns the idea
  if (idea.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to update this idea' });
  }
  
  // Update idea
  idea = await Idea.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: idea
  });
});

/**
 * Delete an idea
 * @route   DELETE /api/ideas/:id
 * @access  Private
 */
const deleteIdea = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  
  // Check if idea exists
  if (!idea) {
    return res.status(404).json({ message: 'Idea not found' });
  }
  
  // Check if user owns the idea
  if (idea.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to delete this idea' });
  }
  
  await idea.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  generateIdeas,
  getUserIdeas,
  getIdeaById,
  saveIdea,
  updateIdea,
  deleteIdea
};