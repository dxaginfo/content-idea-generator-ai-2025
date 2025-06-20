import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import ideaService from '../../services/ideaService';

export interface IdeaContent {
  title: string;
  description: string;
  contentType: 'blog' | 'video' | 'social';
  keywords: string[];
  targetAudience?: string;
  estimatedEngagement?: string;
}

export interface Idea {
  id: string;
  content: IdeaContent;
  createdAt: string;
  userId: string;
  isSaved: boolean;
  isScheduled?: boolean;
  scheduledDate?: string;
}

interface IdeaState {
  ideas: Idea[];
  currentIdea: Idea | null;
  generatedIdeas: Idea[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IdeaState = {
  ideas: [],
  currentIdea: null,
  generatedIdeas: [],
  isLoading: false,
  error: null,
};

export const generateIdeas = createAsyncThunk(
  'ideas/generate',
  async (
    {
      contentType,
      industry,
      audience,
      tone,
      count,
    }: {
      contentType: 'blog' | 'video' | 'social';
      industry: string;
      audience: string;
      tone: string;
      count: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await ideaService.generateIdeas(contentType, industry, audience, tone, count);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate ideas');
    }
  }
);

export const saveIdea = createAsyncThunk(
  'ideas/save',
  async (idea: Omit<Idea, 'id' | 'createdAt' | 'userId' | 'isSaved'>, { rejectWithValue }) => {
    try {
      const response = await ideaService.saveIdea(idea);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save idea');
    }
  }
);

export const fetchIdeas = createAsyncThunk('ideas/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await ideaService.getIdeas();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch ideas');
  }
});

export const deleteIdea = createAsyncThunk(
  'ideas/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await ideaService.deleteIdea(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete idea');
    }
  }
);

export const ideaSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    clearGeneratedIdeas: (state) => {
      state.generatedIdeas = [];
    },
    setCurrentIdea: (state, action: PayloadAction<Idea>) => {
      state.currentIdea = action.payload;
    },
    clearCurrentIdea: (state) => {
      state.currentIdea = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateIdeas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateIdeas.fulfilled, (state, action: PayloadAction<Idea[]>) => {
        state.isLoading = false;
        state.generatedIdeas = action.payload;
      })
      .addCase(generateIdeas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveIdea.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveIdea.fulfilled, (state, action: PayloadAction<Idea>) => {
        state.isLoading = false;
        state.ideas.push(action.payload);
      })
      .addCase(saveIdea.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchIdeas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIdeas.fulfilled, (state, action: PayloadAction<Idea[]>) => {
        state.isLoading = false;
        state.ideas = action.payload;
      })
      .addCase(fetchIdeas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteIdea.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteIdea.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.ideas = state.ideas.filter((idea) => idea.id !== action.payload);
      })
      .addCase(deleteIdea.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearGeneratedIdeas, setCurrentIdea, clearCurrentIdea, clearError } =
  ideaSlice.actions;

export const selectIdeas = (state: RootState) => state.ideas;

export default ideaSlice.reducer;
