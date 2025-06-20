const express = require('express');
const router = express.Router();
const {
  generateIdeas,
  getIdeas,
  getIdea,
  createIdea,
  updateIdea,
  deleteIdea,
} = require('../controllers/ideaController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Generate ideas and get all ideas routes
router.route('/generate').post(generateIdeas);
router.route('/').get(getIdeas).post(createIdea);

// Individual idea routes
router.route('/:id').get(getIdea).put(updateIdea).delete(deleteIdea);

module.exports = router;