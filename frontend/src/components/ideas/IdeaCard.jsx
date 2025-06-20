import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  Chip, 
  IconButton, 
  Tooltip, 
  Typography,
  useTheme 
} from '@mui/material';
import { 
  BookmarkBorder, 
  Bookmark, 
  CalendarToday, 
  ContentCopy, 
  Edit, 
  Delete, 
  Share
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { saveIdea, deleteIdea, toggleSaveIdea } from '../../redux/ideas/ideasSlice';

// Component to render the engagement indicator with appropriate color
const EngagementIndicator = ({ level }) => {
  const theme = useTheme();
  
  const getEngagementColor = () => {
    const normalizedLevel = level?.toLowerCase();
    if (normalizedLevel === 'high') return theme.palette.success.main;
    if (normalizedLevel === 'medium') return theme.palette.warning.main;
    if (normalizedLevel === 'low') return theme.palette.error.main;
    return theme.palette.info.main;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Engagement Potential:
      </Typography>
      <Chip 
        size="small" 
        label={level || 'Unknown'} 
        sx={{ 
          backgroundColor: getEngagementColor(),
          color: 'white',
          fontWeight: 'bold',
          minWidth: 70,
          textTransform: 'capitalize'
        }} 
      />
    </Box>
  );
};

EngagementIndicator.propTypes = {
  level: PropTypes.string,
};

const IdeaCard = ({ idea, isGenerated, onSchedule }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleSave = () => {
    if (isGenerated) {
      dispatch(saveIdea(idea));
    } else {
      dispatch(toggleSaveIdea(idea._id));
    }
  };

  const handleDelete = () => {
    if (!isGenerated) {
      dispatch(deleteIdea(idea._id));
    }
  };

  const handleCopyToClipboard = () => {
    const textToCopy = `
      Title: ${idea.content.title}
      
      Description: ${idea.content.description}
      
      Keywords: ${idea.content.keywords?.join(', ') || ''}
      
      Target Audience: ${idea.content.targetAudience || ''}
      
      Engagement Potential: ${idea.content.estimatedEngagement || ''}
    `;
    
    navigator.clipboard.writeText(textToCopy.trim());
    // Could add a snackbar notification here
  };

  return (
    <Card 
      elevation={3} 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[8],
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          variant="h6" 
          component="h3" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {idea.content.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          paragraph
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            mb: 2
          }}
        >
          {idea.content.description}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <EngagementIndicator level={idea.content.estimatedEngagement} />
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Target Audience: <Box component="span" sx={{ fontWeight: 'medium' }}>{idea.content.targetAudience}</Box>
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
          {idea.content.keywords?.map((keyword, index) => (
            <Chip 
              key={index} 
              label={keyword} 
              size="small" 
              variant="outlined"
              sx={{ 
                backgroundColor: `${theme.palette.primary.light}20`, 
                borderColor: theme.palette.primary.light 
              }} 
            />
          ))}
        </Box>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
        <Box>
          <Tooltip title={idea.isSaved ? "Unsave Idea" : "Save Idea"}>
            <IconButton onClick={handleSave} color={idea.isSaved ? "primary" : "default"}>
              {idea.isSaved ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Copy to Clipboard">
            <IconButton onClick={handleCopyToClipboard}>
              <ContentCopy />
            </IconButton>
          </Tooltip>
          
          {!isGenerated && (
            <Tooltip title="Delete Idea">
              <IconButton onClick={handleDelete} color="error">
                <Delete />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        <Box>
          {!isGenerated && !idea.isScheduled && (
            <Button 
              startIcon={<CalendarToday />}
              size="small"
              onClick={() => onSchedule(idea)}
              variant="outlined"
            >
              Schedule
            </Button>
          )}
          
          {isGenerated && (
            <Button 
              startIcon={<Edit />}
              size="small"
              variant="contained"
              color="primary"
            >
              Edit & Save
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

IdeaCard.propTypes = {
  idea: PropTypes.shape({
    _id: PropTypes.string,
    content: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      contentType: PropTypes.string,
      keywords: PropTypes.arrayOf(PropTypes.string),
      targetAudience: PropTypes.string,
      estimatedEngagement: PropTypes.string,
    }).isRequired,
    isSaved: PropTypes.bool,
    isScheduled: PropTypes.bool,
  }).isRequired,
  isGenerated: PropTypes.bool,
  onSchedule: PropTypes.func,
};

IdeaCard.defaultProps = {
  isGenerated: false,
  onSchedule: () => {},
};

export default IdeaCard;