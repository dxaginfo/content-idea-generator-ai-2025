import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Today as TodayIcon,
  ViewModule as ViewModuleIcon,
  ViewDay as ViewDayIcon,
  ViewWeek as ViewWeekIcon,
  ViewMonth as ViewMonthIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

// Initialize the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { ideas, loading } = useSelector((state) => state.ideas);
  
  // State for calendar events
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(moment());
  const [selectedView, setSelectedView] = useState('month');
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '', severity: 'success' });
  
  // Fetch calendar events when component mounts
  useEffect(() => {
    fetchCalendarEvents();
  }, [dispatch]);
  
  // Mock function for fetching calendar events - replace with actual API call
  const fetchCalendarEvents = () => {
    // This is a placeholder - you'll implement actual API call here
    // Example: dispatch(getCalendarEvents());
    
    // For now, use any scheduled ideas from the Redux store
    const scheduledIdeas = ideas.filter(idea => idea.isScheduled);
    
    const formattedEvents = scheduledIdeas.map(idea => ({
      id: idea._id,
      title: idea.content.title,
      start: new Date(idea.scheduledDate),
      end: moment(idea.scheduledDate).add(1, 'hour').toDate(),
      resource: idea
    }));
    
    setEvents(formattedEvents);
  };
  
  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setScheduledDate(moment(event.start));
    setIsDialogOpen(true);
  };
  
  // Handle slot selection (clicking on a calendar time slot)
  const handleSelectSlot = ({ start }) => {
    setSelectedEvent(null);
    setScheduledDate(moment(start));
    setIsDialogOpen(true);
  };
  
  // Close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };
  
  // Save scheduled event
  const handleSaveEvent = () => {
    if (selectedEvent) {
      // Update existing event
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, start: scheduledDate.toDate(), end: scheduledDate.add(1, 'hour').toDate() } 
          : event
      );
      setEvents(updatedEvents);
      
      // API call to update event
      // dispatch(scheduleIdea({ id: selectedEvent.id, scheduledDate: scheduledDate.toISOString() }));
      
      setAlertInfo({
        open: true,
        message: 'Event updated successfully',
        severity: 'success'
      });
    } else {
      // Show idea selection dialog or direct user to ideas page
      setAlertInfo({
        open: true,
        message: 'Please select an idea to schedule from the Ideas page',
        severity: 'info'
      });
    }
    handleCloseDialog();
  };
  
  // Delete scheduled event
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
      setEvents(updatedEvents);
      
      // API call to unschedule event
      // dispatch(unscheduleIdea(selectedEvent.id));
      
      setAlertInfo({
        open: true,
        message: 'Event removed from calendar',
        severity: 'success'
      });
    }
    handleCloseDialog();
  };
  
  // Custom toolbar component
  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Box>
        <Button 
          onClick={() => onNavigate('TODAY')}
          startIcon={<TodayIcon />}
          sx={{ mr: 1 }}
        >
          Today
        </Button>
        <Button onClick={() => onNavigate('PREV')}>&lt;</Button>
        <Button onClick={() => onNavigate('NEXT')}>&gt;</Button>
      </Box>
      
      <Typography variant="h6">{label}</Typography>
      
      <Box>
        <Tooltip title="Month view">
          <IconButton 
            onClick={() => onView('month')}
            color={selectedView === 'month' ? 'primary' : 'default'}
          >
            <ViewModuleIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Week view">
          <IconButton 
            onClick={() => onView('week')}
            color={selectedView === 'week' ? 'primary' : 'default'}
          >
            <ViewWeekIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Day view">
          <IconButton 
            onClick={() => onView('day')}
            color={selectedView === 'day' ? 'primary' : 'default'}
          >
            <ViewDayIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
  
  // Custom event component
  const EventComponent = ({ event }) => (
    <Tooltip title={`${event.title} - ${event.resource?.content?.contentType || 'Content'}`}>
      <Box
        sx={{
          backgroundColor: getEventColor(event.resource?.content?.contentType),
          color: '#fff',
          borderRadius: '4px',
          padding: '2px 5px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '0.85rem',
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {event.title}
      </Box>
    </Tooltip>
  );
  
  // Get event color based on content type
  const getEventColor = (contentType) => {
    switch (contentType) {
      case 'blog':
        return '#1976d2'; // Blue
      case 'video':
        return '#d32f2f'; // Red
      case 'social':
        return '#388e3c'; // Green
      default:
        return '#7b1fa2'; // Purple
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Content Calendar
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Schedule and manage your content publishing dates. Drag and drop events to reschedule.
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 600 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              views={['month', 'week', 'day']}
              defaultView="month"
              onView={(view) => setSelectedView(view)}
              selectable
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              components={{
                toolbar: CustomToolbar,
                event: EventComponent
              }}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: getEventColor(event.resource?.content?.contentType),
                }
              })}
              popup
              tooltipAccessor={null} // We're using our custom tooltip
            />
          </Box>
        )}
      </Paper>
      
      {/* Calendar event dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEvent ? 'Edit Scheduled Content' : 'Schedule New Content'}
        </DialogTitle>
        <DialogContent>
          {selectedEvent ? (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedEvent.title}
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedEvent.resource?.content?.description || 'No description available'}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Type: {selectedEvent.resource?.content?.contentType || 'N/A'}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    label="Schedule Date & Time"
                    value={scheduledDate}
                    onChange={(newValue) => setScheduledDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Box>
            </>
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" paragraph>
                To schedule content, first select an idea from the Ideas page and then click "Schedule" button.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Alternatively, you can go to the Ideas page and select "Schedule" from the idea actions menu.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedEvent && (
            <Button 
              onClick={handleDeleteEvent} 
              color="error" 
              startIcon={<DeleteIcon />}
            >
              Remove from Calendar
            </Button>
          )}
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {selectedEvent && (
            <Button 
              onClick={handleSaveEvent} 
              variant="contained" 
              color="primary"
            >
              Save Changes
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Alert Snackbar */}
      <Snackbar
        open={alertInfo.open}
        autoHideDuration={6000}
        onClose={() => setAlertInfo({ ...alertInfo, open: false })}
      >
        <Alert 
          onClose={() => setAlertInfo({ ...alertInfo, open: false })} 
          severity={alertInfo.severity}
          sx={{ width: '100%' }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CalendarView;