const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');
const usersController = require('../../controllers/users.controller');

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, usersController.getUserProfile);

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', protect, usersController.updateUserProfile);

// @route   POST /api/users/password-reset-request
// @desc    Request password reset (sends email)
// @access  Public
router.post('/password-reset-request', usersController.requestPasswordReset);

// @route   POST /api/users/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', usersController.resetPassword);

// @route   POST /api/users/verify-email
// @desc    Verify email address
// @access  Public
router.post('/verify-email', usersController.verifyEmail);

module.exports = router;