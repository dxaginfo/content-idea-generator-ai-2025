import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import ideaReducer from './ideas/ideaSlice';
import uiReducer from './ui/uiSlice';
import calendarReducer from './calendar/calendarSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ideas: ideaReducer,
    ui: uiReducer,
    calendar: calendarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;