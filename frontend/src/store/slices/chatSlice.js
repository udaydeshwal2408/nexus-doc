import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000/api';

export const uploadDocument = createAsyncThunk(
  'chat/uploadDocument',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const queryDocument = createAsyncThunk(
  'chat/queryDocument',
  async (question, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/query`, { question });
      return { question, answer: response.data.answer };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    documentUploaded: false,
    isUploading: false,
    uploadError: null,
    messages: [], // { role: 'user' | 'assistant', content: string }
    isQuerying: false,
    queryError: null,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ role: 'user', content: action.payload });
    }
  },
  extraReducers: (builder) => {
    builder
      // Upload cases
      .addCase(uploadDocument.pending, (state) => {
        state.isUploading = true;
        state.uploadError = null;
      })
      .addCase(uploadDocument.fulfilled, (state) => {
        state.isUploading = false;
        state.documentUploaded = true;
        state.messages.push({
          role: 'assistant',
          content: 'Document successfully indexed! What would you like to know about it?'
        });
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadError = action.payload;
      })
      // Query cases
      .addCase(queryDocument.pending, (state, action) => {
        state.isQuerying = true;
        state.queryError = null;
        // The question is already added to messages before dispatching this
      })
      .addCase(queryDocument.fulfilled, (state, action) => {
        state.isQuerying = false;
        state.messages.push({
          role: 'assistant',
          content: action.payload.answer
        });
      })
      .addCase(queryDocument.rejected, (state, action) => {
        state.isQuerying = false;
        state.queryError = action.payload;
        state.messages.push({
          role: 'assistant',
          content: `Error: ${action.payload}`
        });
      });
  }
});

export default chatSlice.reducer;
