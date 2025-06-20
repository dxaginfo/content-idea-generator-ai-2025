import React from 'react';
import { Helmet } from 'react-helmet-async';
import CalendarPage from './CalendarPage';

const ContentCalendarPage = () => {
  return (
    <>
      <Helmet>
        <title>Content Calendar | AI Content Idea Generator</title>
        <meta 
          name="description" 
          content="Plan and schedule your content with our interactive content calendar" 
        />
      </Helmet>
      
      <CalendarPage />
    </>
  );
};

export default ContentCalendarPage;