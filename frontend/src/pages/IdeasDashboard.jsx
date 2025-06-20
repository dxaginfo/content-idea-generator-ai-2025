import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { Add, Refresh, FilterList } from '@mui/icons-material';
import IdeaGenerationForm from '../components/ideas/IdeaGenerationForm';
import IdeaCard from '../components/ideas/IdeaCard';
import {
  getUserIdeas,
  clearGeneratedIdeas,
  reset,
} from '../redux/ideas/ideasSlice';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ideas-tabpanel-${index}`}
      aria-labelledby={`ideas-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const IdeasDashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    generatedIdeas,
    savedIdeas,
    loading,
    generating,
    error,
    message,
  } = useSelector((state) => state.ideas);

  const [tabValue, setTabValue] = useState(0);
  const [showGenerator, setShowGenerator] = useState(true);
  const [schedulingIdea, setSchedulingIdea] = useState(null);

  // Load user's saved ideas on component mount
  useEffect(() => {
    if (user) {
      dispatch(getUserIdeas());
    }
    return () => dispatch(reset());
  }, [user, dispatch]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Toggle idea generator visibility
  const toggleGenerator = () => {
    setShowGenerator(!showGenerator);
  };

  // Clear generated ideas
  const handleClearGenerated = () => {
    dispatch(clearGeneratedIdeas());
  };

  // Handle scheduling an idea
  const handleScheduleIdea = (idea) => {
    setSchedulingIdea(idea);
    // This would open a scheduling modal in a real implementation
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Content Idea Generator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate and manage content ideas for your blog, social media, and video platforms.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Ideas Generator Column */}
        <Grid item xs={12} md={showGenerator ? 5 : 12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              {showGenerator ? 'Generate New Ideas' : 'Ideas Dashboard'}
            </Typography>
            <Button
              variant="outlined"
              startIcon={showGenerator ? <FilterList /> : <Add />}
              onClick={toggleGenerator}
            >
              {showGenerator ? 'View All Ideas' : 'Create New Ideas'}
            </Button>
          </Box>

          {showGenerator ? (
            <IdeaGenerationForm />
          ) : (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="ideas tabs">
                  <Tab label="All Ideas" id="ideas-tab-0" aria-controls="ideas-tabpanel-0" />
                  <Tab label="Saved Ideas" id="ideas-tab-1" aria-controls="ideas-tabpanel-1" />
                  <Tab label="Scheduled" id="ideas-tab-2" aria-controls="ideas-tabpanel-2" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : savedIdeas.length > 0 ? (
                  <Grid container spacing={3}>
                    {savedIdeas.map((idea) => (
                      <Grid item xs={12} sm={6} md={4} key={idea._id}>
                        <IdeaCard
                          idea={idea}
                          onSchedule={handleScheduleIdea}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      You haven't saved any ideas yet. Generate and save some ideas to get started!
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Add />}
                      onClick={toggleGenerator}
                      sx={{ mt: 2 }}
                    >
                      Generate Ideas
                    </Button>
                  </Box>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : savedIdeas.filter(idea => idea.isSaved).length > 0 ? (
                  <Grid container spacing={3}>
                    {savedIdeas
                      .filter(idea => idea.isSaved)
                      .map((idea) => (
                        <Grid item xs={12} sm={6} md={4} key={idea._id}>
                          <IdeaCard
                            idea={idea}
                            onSchedule={handleScheduleIdea}
                          />
                        </Grid>
                      ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No saved ideas found. Save ideas to access them later!
                    </Typography>
                  </Box>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : savedIdeas.filter(idea => idea.isScheduled).length > 0 ? (
                  <Grid container spacing={3}>
                    {savedIdeas
                      .filter(idea => idea.isScheduled)
                      .map((idea) => (
                        <Grid item xs={12} sm={6} md={4} key={idea._id}>
                          <IdeaCard
                            idea={idea}
                            onSchedule={handleScheduleIdea}
                          />
                        </Grid>
                      ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No scheduled ideas found. Schedule ideas for your content calendar!
                    </Typography>
                  </Box>
                )}
              </TabPanel>
            </Paper>
          )}
        </Grid>

        {/* Generated Ideas Column */}
        {showGenerator && (
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                Generated Ideas
              </Typography>
              {generatedIdeas.length > 0 && (
                <Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Refresh />}
                    onClick={handleClearGenerated}
                    sx={{ mr: 1 }}
                  >
                    Clear Results
                  </Button>
                </Box>
              )}
            </Box>

            {generating ? (
              <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
                <CircularProgress size={60} sx={{ mb: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Generating Creative Ideas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our AI is crafting unique content ideas just for you...
                </Typography>
              </Paper>
            ) : generatedIdeas.length > 0 ? (
              <Grid container spacing={3}>
                {generatedIdeas.map((idea, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <IdeaCard
                      idea={{ content: idea }}
                      isGenerated={true}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper
                elevation={3}
                sx={{
                  p: 5,
                  textAlign: 'center',
                  backgroundColor: `${theme.palette.primary.light}10`,
                  border: `1px dashed ${theme.palette.primary.main}50`,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No Ideas Generated Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Fill out the form to generate AI-powered content ideas for your business.
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="body2">
                  Our AI will generate ideas based on your industry, target audience, and content type.
                </Typography>
              </Paper>
            )}
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default IdeasDashboard;