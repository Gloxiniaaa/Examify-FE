import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch past test results
export const fetchPastTestResults = createAsyncThunk(
  "tests/fetchPastTestResults",
  async (studentId, { rejectWithValue }) => {
    
    try {
      const apiUrl = `${import.meta.env.VITE_REACT_APP_BE_API_URL}/students/${studentId}/results`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tests");
      }
      const data = await response.json();
      // console.log(data);
      
      return data.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice
const studentTestSlice = createSlice({
  name: 'tests',
  initialState: {
    pastResults: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPastTestResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPastTestResults.fulfilled, (state, action) => {
        state.loading = false;
        state.pastResults = action.payload; // Populate results
      })
      .addCase(fetchPastTestResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectStudentTests = (state) => state.studentTests;
export default studentTestSlice.reducer;