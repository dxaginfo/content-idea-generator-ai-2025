const asyncHandler = require('express-async-handler');
const Idea = require('../models/ideaModel');

/**
 * @desc    Get scheduled ideas for calendar view
 * @route   GET /api/calendar
 * @access  Private
 */
const getCalendarEvents = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  // Prepare date filter based on query params
  const dateFilter = {};
  if (startDate) {
    dateFilter.$gte = new Date(startDate);
  }
  if (endDate) {
    dateFilter.$lte = new Date(endDate);
  }
  
  // Find all scheduled ideas for the user
  const query = { 
    userId: req.user.id, 
    isScheduled: true 
  };
  
  // Add date range filter if provided
  if (Object.keys(dateFilter).length > 0) {
    query.scheduledDate = dateFilter;
  }
  
  const ideas = await Idea.find(query).sort('scheduledDate');
  
  // Transform data for calendar view
  const calendarEvents = ideas.map(idea => ({
    id: idea._id,
    title: idea.content.title,
    start: idea.scheduledDate,
    description: idea.content.description,
    contentType: idea.content.contentType,
    status: idea.status
  }));
  
  res.status(200).json({
    success: true,
    count: calendarEvents.length,
    data: calendarEvents
  });
});

/**
 * @desc    Schedule an idea (create or update scheduled time)
 * @route   PUT /api/calendar/:id
 * @access  Private
 */
const scheduleIdea = asyncHandler(async (req, res) => {
  const { scheduledDate } = req.body;
  
  if (!scheduledDate) {
    res.status(400);
    throw new Error('Please provide a scheduled date');
  }
  
  // Find the idea
  const idea = await Idea.findById(req.params.id);
  
  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }
  
  // Check if idea belongs to the user
  if (idea.userId.toString() !== req.user.id.toString()) {
    res.status(403);
    throw new Error('Not authorized to schedule this idea');
  }
  
  // Update the idea
  idea.isScheduled = true;
  idea.scheduledDate = new Date(scheduledDate);
  
  await idea.save();
  
  res.status(200).json({
    success: true,
    data: {
      id: idea._id,
      title: idea.content.title,
      start: idea.scheduledDate,
      description: idea.content.description,
      contentType: idea.content.contentType,
      status: idea.status
    }
  });
});

/**
 * @desc    Unschedule an idea
 * @route   DELETE /api/calendar/:id
 * @access  Private
 */
const unscheduleIdea = asyncHandler(async (req, res) => {
  // Find the idea
  const idea = await Idea.findById(req.params.id);
  
  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }
  
  // Check if idea belongs to the user
  if (idea.userId.toString() !== req.user.id.toString()) {
    res.status(403);
    throw new Error('Not authorized to unschedule this idea');
  }
  
  // Update the idea
  idea.isScheduled = false;
  idea.scheduledDate = null;
  
  await idea.save();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Get ideas scheduled for today
 * @route   GET /api/calendar/today
 * @access  Private
 */
const getTodayEvents = asyncHandler(async (req, res) => {
  // Get today's date range
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  // Find all scheduled ideas for today
  const ideas = await Idea.find({
    userId: req.user.id,
    isScheduled: true,
    scheduledDate: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  }).sort('scheduledDate');
  
  // Transform data for response
  const todayEvents = ideas.map(idea => ({
    id: idea._id,
    title: idea.content.title,
    start: idea.scheduledDate,
    description: idea.content.description,
    contentType: idea.content.contentType,
    status: idea.status
  }));
  
  res.status(200).json({
    success: true,
    count: todayEvents.length,
    data: todayEvents
  });
});

/**
 * @desc    Update multiple idea schedules (for drag and drop)
 * @route   PUT /api/calendar/batch
 * @access  Private
 */
const batchUpdateSchedule = asyncHandler(async (req, res) => {
  const { updates } = req.body;
  
  if (!updates || !Array.isArray(updates) || updates.length === 0) {
    res.status(400);
    throw new Error('Please provide an array of updates');
  }
  
  const updatedEvents = [];
  const errors = [];
  
  // Process each update
  for (const update of updates) {
    try {
      const { id, scheduledDate } = update;
      
      // Find and verify idea ownership
      const idea = await Idea.findById(id);
      
      if (!idea) {
        errors.push({ id, error: 'Idea not found' });
        continue;
      }
      
      if (idea.userId.toString() !== req.user.id.toString()) {
        errors.push({ id, error: 'Not authorized to schedule this idea' });
        continue;
      }
      
      // Update idea
      idea.isScheduled = true;
      idea.scheduledDate = new Date(scheduledDate);
      
      await idea.save();
      
      updatedEvents.push({
        id: idea._id,
        title: idea.content.title,
        start: idea.scheduledDate,
        description: idea.content.description,
        contentType: idea.content.contentType,
        status: idea.status
      });
    } catch (error) {
      errors.push({ id: update.id, error: error.message });
    }
  }
  
  res.status(200).json({
    success: true,
    updated: updatedEvents.length,
    errors: errors.length,
    data: {
      updated: updatedEvents,
      errors
    }
  });
});

module.exports = {
  getCalendarEvents,
  scheduleIdea,
  unscheduleIdea,
  getTodayEvents,
  batchUpdateSchedule
};