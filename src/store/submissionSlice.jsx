// submissionSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch submission details for a specific student and test
export const fetchSubmissionDetails = createAsyncThunk(
  "submissions/fetchSubmissionDetails",
  async ({ testId, studentId }, { rejectWithValue }) => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_REACT_APP_BE_API_URL
      }/tests/${testId}/students/${studentId}/results`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch submission details");
      }

      const data = await response.json();
      if (data.status !== "OK") {
        throw new Error(data.message || "Failed to fetch submission details");
      }

      return data.data; // Return the data object containing result and questions
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice
const submissionSlice = createSlice({
  name: "submissions",
  initialState: {
    submission: null, // To store result and questions
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.submission = action.payload;
      })
      .addCase(fetchSubmissionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectSubmissions = (state) => state.submissions;
export default submissionSlice.reducer;