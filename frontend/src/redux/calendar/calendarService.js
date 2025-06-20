import axios from 'axios';

const API_URL = '/api/calendar/';

// Get calendar events
const getCalendarEvents = async (dateRange, token) => {
  // Build query string for date range
  let queryString = '';
  if (dateRange && (dateRange.startDate || dateRange.endDate)) {
    queryString = '?';
    if (dateRange.startDate) {
      queryString += `startDate=${dateRange.startDate}`;
    }
    if (dateRange.endDate) {
      queryString += queryString.length > 1 ? '&' : '';
      queryString += `endDate=${dateRange.endDate}`;
    }
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + queryString, config);

  return response.data.data;
};

// Schedule an idea
const scheduleIdea = async (scheduleData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { id, scheduledDate } = scheduleData;
  const response = await axios.put(
    API_URL + id,
    { scheduledDate },
    config
  );

  return response.data.data;
};

// Unschedule an idea
const unscheduleIdea = async (ideaId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + ideaId, config);

  return ideaId; // Return the id for filtering in the slice
};

// Get today's events
const getTodayEvents = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'today', config);

  return response.data.data;
};

// Batch update schedules (for drag and drop)
const batchUpdateSchedule = async (updates, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    API_URL + 'batch',
    { updates },
    config
  );

  return response.data.data;
};

const calendarService = {
  getCalendarEvents,
  scheduleIdea,
  unscheduleIdea,
  getTodayEvents,
  batchUpdateSchedule,
};

export default calendarService;