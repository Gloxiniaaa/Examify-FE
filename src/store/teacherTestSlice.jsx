import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createTest = async (testData) => {
  try {
    const apiUrl = `${import.meta.env.VITE_REACT_APP_BE_API_URL}/tests`;

    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating test:", error.message);
    throw error;
  }
};

export const fetchTeacherTests = createAsyncThunk(
  "tests/fetchTests",
  async (teacherId, { rejectWithValue }) => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_REACT_APP_BE_API_URL
      }/tests?teacherId=${teacherId}`;

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
      return data.data; // Return only the 'data' array from the response
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice
const teacherTestSlice = createSlice({
  name: "tests",
  initialState: {
    tests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchTeacherTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectTeacherTests = (state) => state.teacherTests;
export default teacherTestSlice.reducer;
