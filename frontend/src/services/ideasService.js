import axios from 'axios';

// Set base URL from environment or default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
};

// Create axios instance with authorization header
const createAxiosInstance = () => {
  const token = getToken();
  
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Add authorization header if token exists
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  
  return instance;
};

// Generate content ideas
const generateIdeas = async (formData) => {
  const instance = createAxiosInstance();
  const response = await instance.post('/ideas/generate', formData);
  return response.data.data;
};

// Get user's saved ideas
const getUserIdeas = async () => {
  const instance = createAxiosInstance();
  const response = await instance.get('/ideas');
  return response.data.data;
};

// Get idea by ID
const getIdeaById = async (id) => {
  const instance = createAxiosInstance();
  const response = await instance.get(`/ideas/${id}`);
  return response.data.data;
};

// Save a new idea
const saveIdea = async (ideaData) => {
  const instance = createAxiosInstance();
  const response = await instance.post('/ideas', {
    content: ideaData.content,
    isSaved: true,
    isScheduled: false
  });
  return response.data.data;
};

// Update an existing idea
const updateIdea = async (id, ideaData) => {
  const instance = createAxiosInstance();
  const response = await instance.put(`/ideas/${id}`, ideaData);
  return response.data.data;
};

// Delete an idea
const deleteIdea = async (id) => {
  const instance = createAxiosInstance();
  const response = await instance.delete(`/ideas/${id}`);
  return response.data;
};

const ideasService = {
  generateIdeas,
  getUserIdeas,
  getIdeaById,
  saveIdea,
  updateIdea,
  deleteIdea
};

export default ideasService;