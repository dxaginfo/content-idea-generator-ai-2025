import React from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Divider,
  Tooltip
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CompleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

import { unscheduleIdea } from '../../redux/calendar/calendarSlice';

const TodayEvents = ({ events, isLoading, onRefresh }) => {
  const dispatch = useDispatch();
  
  // Handle unscheduling an idea
  const handleUnschedule = (id) => {
    if (window.confirm('Are you sure you want to unschedule this content?')) {
      dispatch(unscheduleIdea(id));
    }
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    return moment(dateString).format('h:mm A');
  };
  
  // Get status chip based on status
  const getStatusChip = (event) => {
    let color = 'default';
    let label = 'Draft';
    
    if (event.isScheduled && !event.isPublished) {
      color = 'primary';
      label = 'Scheduled';
    } else if (event.isPublished) {
      color = 'success';
      label = 'Published';
    }
    
    return (
      <Chip 
        size="small" 
        color={color} 
        label={label} 
        sx={{ ml: 1 }} 
      />
    );
  };
  
  // Calculate time difference from now
  const getTimeDifference = (dateString) => {
    const eventTime = moment(dateString);
    const now = moment();
    
    if (eventTime.isBefore(now)) {
      return 'Overdue';
    }
    
    const diff = eventTime.diff(now, 'hours');
    if (diff < 1) {
      return 'Due soon';
    }
    
    return `In ${diff} hours`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {events.length === 0 ? 'No content scheduled for today' : `${events.length} items scheduled`}
        </Typography>
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? <CircularProgress size={18} /> : <RefreshIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : events.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You don't have any content scheduled for today.
          </Typography>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => {
              // Navigate to schedule content view or open schedule modal
            }}
          >
            Schedule Content
          </Button>
        </Box>
      ) : (
        <List disablePadding>
          {events.map((event) => (
            <Card key={event._id} sx={{ mb: 2, borderLeft: 4, borderColor: 'primary.main' }}>
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
                    {event.title}
                    {getStatusChip(event)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatTime(event.scheduledDate)}
                    <Chip 
                      size="small" 
                      label={getTimeDifference(event.scheduledDate)} 
                      sx={{ ml: 1 }}
                      color={getTimeDifference(event.scheduledDate) === 'Overdue' ? 'error' : 'default'}
                      variant="outlined"
                    />
                  </Typography>
                </Box>
                
                {event.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {event.description.length > 60 
                      ? `${event.description.substring(0, 60)}...` 
                      : event.description}
                  </Typography>
                )}
                
                {event.keywords && event.keywords.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {event.keywords.slice(0, 3).map((keyword, index) => (
                      <Chip 
                        key={index} 
                        label={keyword} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                    {event.keywords.length > 3 && (
                      <Chip 
                        label={`+${event.keywords.length - 3}`} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                )}
              </CardContent>
              
              <Divider />
              
              <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                {!event.isPublished && (
                  <Tooltip title="Mark as published">
                    <IconButton size="small" color="success">
                      <CompleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Edit">
                  <IconButton size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Unschedule">
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleUnschedule(event._id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          ))}
        </List>
      )}
    </Box>
  );
};

export default TodayEvents;