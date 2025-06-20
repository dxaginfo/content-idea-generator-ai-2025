const express = require('express');
const router = express.Router();
const {
  getCalendarEvents,
  scheduleIdea,
  unscheduleIdea,
  getTodayEvents,
  batchUpdateSchedule
} = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Calendar routes
router.route('/').get(getCalendarEvents);
router.route('/today').get(getTodayEvents);
router.route('/batch').put(batchUpdateSchedule);
router.route('/:id').put(scheduleIdea).delete(unscheduleIdea);

module.exports = router;