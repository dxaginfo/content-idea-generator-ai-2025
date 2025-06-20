import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ideasService from '../../services/ideasService';

// Generate content ideas
export const generateIdeas = createAsyncThunk(
  'ideas/generate',
  async (formData, thunkAPI) => {
    try {
      return await ideasService.generateIdeas(formData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to generate ideas';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user's saved ideas
export const getUserIdeas = createAsyncThunk(
  'ideas/getUserIdeas',
  async (_, thunkAPI) => {
    try {
      return await ideasService.getUserIdeas();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch ideas';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Save an idea
export const saveIdea = createAsyncThunk(
  'ideas/saveIdea',
  async (idea, thunkAPI) => {
    try {
      return await ideasService.saveIdea(idea);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to save idea';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update an idea
export const updateIdea = createAsyncThunk(
  'ideas/updateIdea',
  async ({ id, ideaData }, thunkAPI) => {
    try {
      return await ideasService.updateIdea(id, ideaData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update idea';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete an idea
export const deleteIdea = createAsyncThunk(
  'ideas/deleteIdea',
  async (id, thunkAPI) => {
    try {
      await ideasService.deleteIdea(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete idea';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Toggle save status
export const toggleSaveIdea = createAsyncThunk(
  'ideas/toggleSaveIdea',
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const idea = state.ideas.savedIdeas.find(idea => idea._id === id);
      
      if (!idea) {
        return thunkAPI.rejectWithValue('Idea not found');
      }
      
      const updatedIdea = {
        ...idea,
        isSaved: !idea.isSaved
      };
      
      const result = await ideasService.updateIdea(id, updatedIdea);
      return result;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update idea';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  generatedIdeas: [],
  savedIdeas: [],
  currentIdea: null,
  loading: false,
  generating: false,
  success: false,
  error: false,
  message: '',
};

const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.generating = false;
      state.success = false;
      state.error = false;
      state.message = '';
    },
    clearGeneratedIdeas: (state) => {
      state.generatedIdeas = [];
    },
    setCurrentIdea: (state, action) => {
      state.currentIdea = action.payload;
    },
    clearCurrentIdea: (state) => {
      state.currentIdea = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Ideas
      .addCase(generateIdeas.pending, (state) => {
        state.generating = true;
        state.loading = true;
      })
      .addCase(generateIdeas.fulfilled, (state, action) => {
        state.generating = false;
        state.loading = false;
        state.success = true;
        state.generatedIdeas = action.payload;
      })
      .addCase(generateIdeas.rejected, (state, action) => {
        state.generating = false;
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      
      // Get User Ideas
      .addCase(getUserIdeas.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserIdeas.fulfilled, (state, action) => {
        state.loading = false;
        state.savedIdeas = action.payload;
      })
      .addCase(getUserIdeas.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      
      // Save Idea
      .addCase(saveIdea.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveIdea.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.savedIdeas.unshift(action.payload);
      })
      .addCase(saveIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      
      // Update Idea
      .addCase(updateIdea.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateIdea.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.savedIdeas = state.savedIdeas.map(idea => 
          idea._id === action.payload._id ? action.payload : idea
        );
        if (state.currentIdea && state.currentIdea._id === action.payload._id) {
          state.currentIdea = action.payload;
        }
      })
      .addCase(updateIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      
      // Delete Idea
      .addCase(deleteIdea.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteIdea.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.savedIdeas = state.savedIdeas.filter(idea => idea._id !== action.payload);
        if (state.currentIdea && state.currentIdea._id === action.payload) {
          state.currentIdea = null;
        }
      })
      .addCase(deleteIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })
      
      // Toggle Save Idea
      .addCase(toggleSaveIdea.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.savedIdeas = state.savedIdeas.map(idea => 
          idea._id === action.payload._id ? action.payload : idea
        );
      });
  },
});

export const { reset, clearGeneratedIdeas, setCurrentIdea, clearCurrentIdea } = ideasSlice.actions;
export default ideasSlice.reducer;