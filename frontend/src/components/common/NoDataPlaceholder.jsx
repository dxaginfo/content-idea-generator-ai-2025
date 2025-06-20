import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import EmptyIllustration from '../../assets/images/empty-state.svg';

/**
 * Reusable component for displaying empty state placeholder
 * @param {Object} props - Component props
 * @param {string} props.message - Main message to display
 * @param {string} props.subMessage - Secondary message with instruction
 * @param {string} props.actionText - Text for action button
 * @param {string} props.actionLink - URL for action button
 * @param {function} props.onActionClick - Optional click handler instead of link
 * @param {string} props.illustration - Optional custom illustration URL
 * @param {number} props.maxWidth - Max width of the placeholder
 */
const NoDataPlaceholder = ({
  message = 'No data available',
  subMessage = 'There is no data to display at this time',
  actionText,
  actionLink,
  onActionClick,
  illustration = EmptyIllustration,
  maxWidth = 300
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 3,
        maxWidth: maxWidth,
        mx: 'auto'
      }}
    >
      <Box
        component="img"
        src={illustration}
        alt="No data"
        sx={{
          width: '100%',
          maxWidth: 180,
          mb: 2,
          opacity: 0.7
        }}
      />
      <Typography variant="h6" color="text.primary" gutterBottom>
        {message}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {subMessage}
      </Typography>
      
      {actionText && (onActionClick || actionLink) && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={onActionClick}
          component={onActionClick ? 'button' : Link}
          to={!onActionClick ? actionLink : undefined}
          sx={{ mt: 1 }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default NoDataPlaceholder;