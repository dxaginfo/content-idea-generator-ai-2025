import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Grid, Paper, Button } from '@mui/material';
import { Add as AddIcon, ViewList as ViewListIcon } from '@mui/icons-material';
import CalendarView from '../components/calendar/CalendarView';

const CalendarPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  return (
    <>
      <Helmet>
        <title>Content Calendar | AI Content Idea Generator</title>
        <meta 
          name="description" 
          content="Plan and schedule your content with our interactive content calendar" 
        />
      </Helmet>
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h4" component="h1">
                Content Calendar
              </Typography>
              <Box>
                <Button 
                  variant="outlined" 
                  startIcon={<ViewListIcon />} 
                  sx={{ mr: 2 }}
                  onClick={() => navigate('/ideas')}
                >
                  View Ideas
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/generate')}
                >
                  Generate New Ideas
                </Button>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 0,
                borderRadius: 2,
                boxShadow: (theme) => theme.shadows[3],
                overflow: 'hidden',
              }}
            >
              <CalendarView />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Today's Content
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage content scheduled for today
              </Typography>
              {/* You would include a TodayContent component here */}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Content
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preview content scheduled for the next 7 days
              </Typography>
              {/* You would include an UpcomingContent component here */}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Content Statistics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View your content distribution by type and status
              </Typography>
              {/* You would include a ContentStats component here */}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CalendarPage;