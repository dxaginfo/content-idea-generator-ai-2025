import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Skeleton,
  Alert
} from '@mui/material';
import {
  CalendarToday as CalendarTodayIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Public as PublishIcon,
  DeleteOutline as DeleteIcon,
  EventBusy as UnscheduleIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import moment from 'moment';

import { fetchTodayContent } from '../../redux/calendar/calendarSlice';
import EventDetailsModal from '../calendar/EventDetailsModal';
import NoDataPlaceholder from '../common/NoDataPlaceholder';

const TodayContent = ({ limit = 5, showViewAll = true }) => {
  const dispatch = useDispatch();
  
  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);
  
  // Get data from Redux
  const { todayContent, isLoading, error } = useSelector((state) => state.calendar);
  
  // Fetch today's content on component mount
  useEffect(() => {
    dispatch(fetchTodayContent());
    
    // Set up automatic refresh every 5 minutes
    const interval = setInterval(() => {
      dispatch(fetchTodayContent());
    }, 5 * 60 * 1000);
    
    setRefreshInterval(interval);
    
    // Clean up interval on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [dispatch]);
  
  // Handle opening the details modal
  const handleViewDetails = (content) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };
  
  // Handle closing the details modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };
  
  // Helper to get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'scheduled':
        return 'primary';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };
  
  // Get limited content
  const displayContent = limit ? todayContent.slice(0, limit) : todayContent;
  
  // Render loading state
  if (isLoading && !todayContent.length) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarTodayIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6">Today's Content</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {[...Array(3)].map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="text" width="30%" height={20} />
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarTodayIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6">Today's Content</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }
  
  // Render empty state
  if (!todayContent.length) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarTodayIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6">Today's Content</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <NoDataPlaceholder 
            message="No content scheduled for today"
            subMessage="Use the calendar to schedule content ideas"
            actionText="Create Content"
            actionLink="/content/create"
          />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6">Today's Content</Typography>
          </Box>
          
          {isLoading && <CircularProgress size={20} />}
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <List disablePadding>
          {displayContent.map((content) => (
            <ListItem 
              key={content._id}
              disablePadding
              sx={{ 
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': {
                  borderBottom: 'none'
                }
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="medium" noWrap>
                      {content.title}
                    </Typography>
                    <Chip 
                      label={content.status} 
                      size="small" 
                      color={getStatusColor(content.status)}
                      sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {moment(content.scheduledDate).format('h:mm A')}
                    </Typography>
                    {content.contentType && (
                      <Chip
                        label={content.contentType}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          height: 18, 
                          fontSize: '0.65rem',
                          mr: 0.5,
                          mt: 0.5
                        }}
                      />
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title="View Details">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleViewDetails(content)}
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
      
      {showViewAll && todayContent.length > limit && (
        <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
          <Button 
            size="small" 
            color="primary" 
            sx={{ fontSize: '0.8rem' }}
            href="/calendar"
          >
            View All ({todayContent.length})
          </Button>
        </CardActions>
      )}
      
      {selectedContent && (
        <EventDetailsModal
          open={isModalOpen}
          onClose={handleCloseModal}
          event={selectedContent}
        />
      )}
    </Card>
  );
};

export default TodayContent;