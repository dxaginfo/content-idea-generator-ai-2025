import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  TextField,
  CircularProgress,
  Alert,
  Autocomplete,
  IconButton,
  Divider,
  Grid
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { scheduleIdea } from '../../redux/calendar/calendarSlice';
import { getIdeas } from '../../redux/ideas/ideasSlice';

const ScheduleIdeaModal = ({ open, onClose, selectedDate }) => {
  const dispatch = useDispatch();
  
  // Get ideas from Redux store
  const { ideas, isLoading: ideasLoading } = useSelector((state) => state.ideas);
  const { isLoading: calendarLoading } = useSelector((state) => state.calendar);
  
  // Local state
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [dateTime, setDateTime] = useState(selectedDate || new Date());
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Load ideas on component mount
  useEffect(() => {
    dispatch(getIdeas({ filter: 'unscheduled' }));
  }, [dispatch]);
  
  // Handle scheduling the idea
  const handleSchedule = async () => {
    if (!selectedIdea) {
      setError('Please select an idea to schedule');
      return;
    }
    
    if (!dateTime) {
      setError('Please select a date and time');
      return;
    }
    
    setError(null);
    
    try {
      // Format data for API
      const scheduleData = {
        id: selectedIdea._id,
        scheduledDate: dateTime
      };
      
      // Dispatch action to schedule idea
      await dispatch(scheduleIdea(scheduleData)).unwrap();
      
      // Show success message and close after delay
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to schedule idea. Please try again.');
    }
  };
  
  // Reset state when modal is closed
  const handleClose = () => {
    setSelectedIdea(null);
    setError(null);
    setSuccess(false);
    onClose();
  };
  
  // Loading state
  const isLoading = ideasLoading || calendarLoading;
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Schedule Content</Typography>
          <IconButton onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Content scheduled successfully!
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Select Content to Schedule
            </Typography>
            <Autocomplete
              fullWidth
              loading={ideasLoading}
              options={ideas.filter(idea => !idea.isScheduled) || []}
              getOptionLabel={(option) => option.title}
              value={selectedIdea}
              onChange={(event, newValue) => {
                setSelectedIdea(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Content Title"
                  placeholder="Search for content ideas"
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {ideasLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Schedule Date & Time
            </Typography>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                label="Date & Time"
                value={dateTime}
                onChange={(newValue) => {
                  setDateTime(newValue);
                }}
                renderInput={(params) => <TextField {...params} fullWidth required />}
                minDateTime={moment()}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        
        {selectedIdea && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Content Preview
            </Typography>
            
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {selectedIdea.title}
              </Typography>
              
              {selectedIdea.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {selectedIdea.description}
                </Typography>
              )}
              
              {selectedIdea.keywords && selectedIdea.keywords.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {selectedIdea.keywords.map((keyword, index) => (
                    <Typography
                      key={index}
                      variant="caption"
                      sx={{
                        px: 1,
                        py: 0.5,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        borderRadius: 1,
                        fontSize: '0.7rem'
                      }}
                    >
                      {keyword}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSchedule}
          disabled={!selectedIdea || !dateTime || isLoading || success}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Schedule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleIdeaModal;