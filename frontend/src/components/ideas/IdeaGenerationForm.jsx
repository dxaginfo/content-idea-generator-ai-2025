import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { LightbulbOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { generateIdeas } from '../../redux/ideas/ideasSlice';

// Content type options
const contentTypes = [
  { value: 'blog', label: 'Blog Post' },
  { value: 'video', label: 'Video Content' },
  { value: 'social', label: 'Social Media Post' },
];

// Industry options
const industries = [
  { value: 'technology', label: 'Technology' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'travel', label: 'Travel' },
  { value: 'food', label: 'Food & Cooking' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'sports', label: 'Sports & Fitness' },
  { value: 'business', label: 'Business' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'other', label: 'Other' },
];

// Tone options
const tones = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'educational', label: 'Educational' },
  { value: 'controversial', label: 'Controversial' },
];

// Validation schema
const validationSchema = Yup.object({
  contentType: Yup.string().required('Content type is required'),
  industry: Yup.string().required('Industry is required'),
  audience: Yup.string().required('Target audience is required'),
  tone: Yup.string().required('Tone is required'),
  count: Yup.number().min(1).max(10).required('Number of ideas is required'),
});

const IdeaGenerationForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.ideas);
  const [customIndustry, setCustomIndustry] = useState('');

  const formik = useFormik({
    initialValues: {
      contentType: 'blog',
      industry: 'technology',
      audience: 'professionals',
      tone: 'professional',
      count: 3,
    },
    validationSchema,
    onSubmit: values => {
      const payload = {
        ...values,
        industry: values.industry === 'other' ? customIndustry : values.industry,
      };
      dispatch(generateIdeas(payload));
    },
  });

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <LightbulbOutlined color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" component="h2">
            Generate Content Ideas
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Content Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.contentType && Boolean(formik.errors.contentType)}>
                <InputLabel>Content Type</InputLabel>
                <Select
                  name="contentType"
                  label="Content Type"
                  value={formik.values.contentType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {contentTypes.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.contentType && formik.errors.contentType && (
                  <FormHelperText>{formik.errors.contentType}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Industry */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.industry && Boolean(formik.errors.industry)}>
                <InputLabel>Industry</InputLabel>
                <Select
                  name="industry"
                  label="Industry"
                  value={formik.values.industry}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {industries.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.industry && formik.errors.industry && (
                  <FormHelperText>{formik.errors.industry}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Custom Industry */}
            {formik.values.industry === 'other' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Specify Industry"
                  value={customIndustry}
                  onChange={e => setCustomIndustry(e.target.value)}
                  placeholder="Enter your specific industry"
                />
              </Grid>
            )}

            {/* Target Audience */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="audience"
                label="Target Audience"
                placeholder="E.g., Small business owners, Parents, Tech enthusiasts"
                value={formik.values.audience}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.audience && Boolean(formik.errors.audience)}
                helperText={formik.touched.audience && formik.errors.audience}
              />
            </Grid>

            {/* Tone */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.tone && Boolean(formik.errors.tone)}>
                <InputLabel>Tone</InputLabel>
                <Select
                  name="tone"
                  label="Tone"
                  value={formik.values.tone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {tones.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.tone && formik.errors.tone && (
                  <FormHelperText>{formik.errors.tone}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Number of Ideas */}
            <Grid item xs={12}>
              <Typography id="idea-count-slider" gutterBottom>
                Number of Ideas: {formik.values.count}
              </Typography>
              <Slider
                name="count"
                aria-labelledby="idea-count-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
                value={formik.values.count}
                onChange={(_, value) => formik.setFieldValue('count', value)}
                sx={{ color: theme.palette.primary.main }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                  sx={{ minWidth: 200 }}
                >
                  {loading ? 'Generating Ideas...' : 'Generate Ideas'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default IdeaGenerationForm;