import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import calendarService from './calendarService';

// Get calendar events
export const getCalendarEvents = createAsyncThunk(
  'calendar/getEvents',
  async (dateRange, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await calendarService.getCalendarEvents(dateRange, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Schedule an idea
export const scheduleIdea = createAsyncThunk(
  'calendar/scheduleIdea',
  async (scheduleData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await calendarService.scheduleIdea(scheduleData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Unschedule an idea
export const unscheduleIdea = createAsyncThunk(
  'calendar/unscheduleIdea',
  async (ideaId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await calendarService.unscheduleIdea(ideaId, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get today's events
export const getTodayEvents = createAsyncThunk(
  'calendar/getTodayEvents',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await calendarService.getTodayEvents(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Batch update schedules (for drag and drop)
export const batchUpdateSchedule = createAsyncThunk(
  'calendar/batchUpdate',
  async (updates, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await calendarService.batchUpdateSchedule(updates, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  events: [],
  todayEvents: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get calendar events
      .addCase(getCalendarEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCalendarEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.events = action.payload;
      })
      .addCase(getCalendarEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Schedule idea
      .addCase(scheduleIdea.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(scheduleIdea.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update events array with new/updated event
        const eventIndex = state.events.findIndex(event => event.id === action.payload.id);
        if (eventIndex >= 0) {
          state.events[eventIndex] = action.payload;
        } else {
          state.events.push(action.payload);
        }
      })
      .addCase(scheduleIdea.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Unschedule idea
      .addCase(unscheduleIdea.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unscheduleIdea.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.events = state.events.filter(event => event.id !== action.payload);
        state.todayEvents = state.todayEvents.filter(event => event.id !== action.payload);
      })
      .addCase(unscheduleIdea.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get today's events
      .addCase(getTodayEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTodayEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todayEvents = action.payload;
      })
      .addCase(getTodayEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Batch update schedules
      .addCase(batchUpdateSchedule.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(batchUpdateSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Update events with batch updates
        action.payload.updated.forEach(updatedEvent => {
          const eventIndex = state.events.findIndex(event => event.id === updatedEvent.id);
          if (eventIndex >= 0) {
            state.events[eventIndex] = updatedEvent;
          }
        });
      })
      .addCase(batchUpdateSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = calendarSlice.actions;
export default calendarSlice.reducer;