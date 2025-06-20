const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');
const ideasController = require('../../controllers/ideas.controller');

// @route   POST /api/ideas/generate
// @desc    Generate new content ideas
// @access  Private
router.post('/generate', protect, ideasController.generateIdeas);

// @route   GET /api/ideas
// @desc    Get all ideas for the authenticated user
// @access  Private
router.get('/', protect, ideasController.getUserIdeas);

// @route   GET /api/ideas/:id
// @desc    Get a specific idea
// @access  Private
router.get('/:id', protect, ideasController.getIdeaById);

// @route   POST /api/ideas
// @desc    Save a new idea
// @access  Private
router.post('/', protect, ideasController.saveIdea);

// @route   PUT /api/ideas/:id
// @desc    Update an existing idea
// @access  Private
router.put('/:id', protect, ideasController.updateIdea);

// @route   DELETE /api/ideas/:id
// @desc    Delete an idea
// @access  Private
router.delete('/:id', protect, ideasController.deleteIdea);

module.exports = router;