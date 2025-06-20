import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CompleteIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  Label as LabelIcon
} from '@mui/icons-material';

import { unscheduleIdea } from '../../redux/calendar/calendarSlice';

const EventDetailsModal = ({ open, onClose, event }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Handle unscheduling the event
  const handleUnschedule = async () => {
    if (window.confirm('Are you sure you want to unschedule this content?')) {
      setIsLoading(true);
      try {
        await dispatch(unscheduleIdea(event._id)).unwrap();
        onClose();
      } catch (error) {
        setError('Failed to unschedule the content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Handle marking as published
  const handleMarkAsPublished = () => {
    // To be implemented
    alert('This feature is coming soon!');
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return moment(dateString).format('MMMM D, YYYY h:mm A');
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '50vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            Content Details
          </Typography>
          <IconButton onClick={onClose} aria-label="close">
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
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {event.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">
              {formatDate(event.scheduledDate)}
            </Typography>
            
            <Chip 
              sx={{ ml: 2 }}
              label={event.isPublished ? 'Published' : 'Scheduled'} 
              color={event.isPublished ? 'success' : 'primary'} 
            />
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Description
            </Typography>
            <Typography variant="body1" gutterBottom>
              {event.description || 'No description provided'}
            </Typography>
            
            {event.content && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                  Content
                </Typography>
                <Typography variant="body1">
                  {event.content}
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center">
                  <CategoryIcon fontSize="small" sx={{ mr: 1 }} />
                  Content Type
                </Typography>
                <Chip 
                  label={event.contentType || 'Unspecified'} 
                  variant="outlined" 
                  size="small" 
                />
              </Box>
              
              {event.category && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center">
                    <CategoryIcon fontSize="small" sx={{ mr: 1 }} />
                    Category
                  </Typography>
                  <Chip 
                    label={event.category} 
                    variant="outlined" 
                    size="small" 
                  />
                </Box>
              )}
              
              {event.keywords && event.keywords.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center">
                    <LabelIcon fontSize="small" sx={{ mr: 1 }} />
                    Keywords
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {event.keywords.map((keyword, index) => (
                      <Chip 
                        key={index} 
                        label={keyword} 
                        size="small" 
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Created
                </Typography>
                <Typography variant="body2">
                  {moment(event.createdAt).format('MMMM D, YYYY')}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Box>
          <Tooltip title="Unschedule">
            <Button 
              color="error" 
              startIcon={<DeleteIcon />}
              onClick={handleUnschedule}
              disabled={isLoading}
            >
              Unschedule
            </Button>
          </Tooltip>
        </Box>
        
        <Box>
          {!event.isPublished && (
            <Tooltip title="Mark as published">
              <Button 
                color="success" 
                startIcon={<CompleteIcon />}
                onClick={handleMarkAsPublished}
                disabled={isLoading}
                sx={{ mr: 1 }}
              >
                Mark Published
              </Button>
            </Tooltip>
          )}
          
          <Tooltip title="Edit content">
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<EditIcon />}
              disabled={isLoading}
            >
              Edit
            </Button>
          </Tooltip>
        </Box>
      </DialogActions>
      
      {isLoading && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1
        }}>
          <CircularProgress />
        </Box>
      )}
    </Dialog>
  );
};

export default EventDetailsModal;