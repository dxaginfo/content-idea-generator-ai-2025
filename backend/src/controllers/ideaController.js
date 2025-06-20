const asyncHandler = require('express-async-handler');
const Idea = require('../models/ideaModel');
const openaiService = require('../services/openaiService');

// @desc    Generate content ideas using AI
// @route   POST /api/ideas/generate
// @access  Private
const generateIdeas = asyncHandler(async (req, res) => {
  const { 
    topic, 
    contentType = 'blog', 
    industry, 
    targetAudience, 
    count = 3,
    tone = 'professional',
    keywords = []
  } = req.body;

  if (!topic) {
    res.status(400);
    throw new Error('Please provide a topic');
  }

  // Build AI prompt based on user input
  let prompt = `Generate ${count} unique content ideas related to "${topic}"`;
  
  if (contentType) {
    prompt += ` for ${contentType} content`;
  }
  
  if (industry) {
    prompt += ` in the ${industry} industry`;
  }
  
  if (targetAudience) {
    prompt += ` targeting ${targetAudience}`;
  }
  
  if (keywords && keywords.length > 0) {
    prompt += ` incorporating these keywords: ${keywords.join(', ')}`;
  }
  
  if (tone) {
    prompt += `. Use a ${tone} tone`;
  }
  
  prompt += `. For each idea, provide a title, description, relevant keywords, target audience, and estimated engagement potential (high, medium, low). Format each idea as a JSON object.`;

  try {
    // Call OpenAI service to generate ideas
    const generatedIdeas = await openaiService.generateContentIdeas(prompt, count);
    
    // Save generated ideas to the database for the user
    const savedIdeas = [];
    
    for (const idea of generatedIdeas) {
      // Add user preferences to content
      const ideaWithMetadata = {
        userId: req.user.id,
        content: {
          ...idea,
          contentType,
          tone,
          industry: industry || '',
          targetAudience: targetAudience || '',
        },
        isSaved: false,
        isScheduled: false,
        status: 'draft'
      };
      
      const savedIdea = await Idea.create(ideaWithMetadata);
      savedIdeas.push(savedIdea);
    }
    
    res.status(200).json({
      success: true,
      count: savedIdeas.length,
      data: savedIdeas,
    });
  } catch (error) {
    console.error('Error generating ideas:', error);
    res.status(500);
    throw new Error(error.message || 'Error generating ideas');
  }
});

// @desc    Get all ideas for a user
// @route   GET /api/ideas
// @access  Private
const getIdeas = asyncHandler(async (req, res) => {
  // Parse query parameters for filtering
  const { 
    contentType, 
    isSaved, 
    isScheduled, 
    status, 
    keyword,
    sort = '-createdAt',
    limit = 10,
    page = 1 
  } = req.query;

  // Build filter query
  const query = { userId: req.user.id };

  if (contentType) {
    query['content.contentType'] = contentType;
  }

  if (isSaved !== undefined) {
    query.isSaved = isSaved === 'true';
  }

  if (isScheduled !== undefined) {
    query.isScheduled = isScheduled === 'true';
  }

  if (status) {
    query.status = status;
  }

  if (keyword) {
    query.$or = [
      { 'content.title': { $regex: keyword, $options: 'i' } },
      { 'content.description': { $regex: keyword, $options: 'i' } },
      { 'content.keywords': { $regex: keyword, $options: 'i' } }
    ];
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const total = await Idea.countDocuments(query);

  const ideas = await Idea.find(query)
    .sort(sort)
    .skip(startIndex)
    .limit(parseInt(limit, 10));

  res.status(200).json({
    success: true,
    count: ideas.length,
    pagination: {
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / limit),
    },
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

  // Check if the idea belongs to the logged-in user
  if (idea.userId.toString() !== req.user.id.toString()) {
    res.status(403);
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
  const { content, isSaved, isScheduled, scheduledDate, notes, status } = req.body;

  if (!content || !content.title || !content.description) {
    res.status(400);
    throw new Error('Please provide title and description');
  }

  const idea = await Idea.create({
    userId: req.user.id,
    content,
    isSaved: isSaved || false,
    isScheduled: isScheduled || false,
    scheduledDate: scheduledDate || null,
    notes: notes || '',
    status: status || 'draft',
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

  // Check if the idea belongs to the logged-in user
  if (idea.userId.toString() !== req.user.id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this idea');
  }

  // Update idea
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

  // Check if the idea belongs to the logged-in user
  if (idea.userId.toString() !== req.user.id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this idea');
  }

  await idea.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  generateIdeas,
  getIdeas,
  getIdea,
  createIdea,
  updateIdea,
  deleteIdea,
};