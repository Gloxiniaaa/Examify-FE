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
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTestDetails = createAsyncThunk(
  "tests/fetchTestDetails",
  async (testId, { rejectWithValue }) => {
    try {
      const teacherId = localStorage.getItem("userId");
      const apiUrl = `${
        import.meta.env.VITE_REACT_APP_BE_API_URL
      }/tests/${testId}?teacherId=${teacherId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch test details");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTest = createAsyncThunk(
  "tests/updateTest",
  async (testData, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BE_API_URL}/tests`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(testData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update test: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status !== "OK") {
        throw new Error(result.message || "Failed to update test");
      }
      
      return {
        ...result,
        testId: testData.id // Ensure we have the testId for further operations
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update test");
    }
  }
);

export const fetchTestResults = createAsyncThunk(
  "tests/fetchTestResults",
  async (testId, { rejectWithValue }) => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_REACT_APP_BE_API_URL
      }/tests/${testId}/results`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch test results");
      }

      const data = await response.json();
      if (data.status !== "OK") {
        throw new Error(data.message || "Failed to fetch test results");
      }

      return data.data; // Return the data object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTest = createAsyncThunk(
  "tests/deleteTest",
  async (testId, { rejectWithValue }) => {
    try {
      const apiUrl = `${import.meta.env.VITE_REACT_APP_BE_API_URL}/tests/${testId}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status !== "OK" && !data.success) {
        throw new Error(data.message || "Failed to delete test");
      }
      
      return { testId, message: data.message || "Test deleted successfully" };
    } catch (error) {
      console.error("Error deleting test:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice
const teacherTestSlice = createSlice({
  name: "tests",
  initialState: {
    tests: [],
    currentTest: null,
    allTestResults: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all tests
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
      })
      // Fetch test details
      .addCase(fetchTestDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTest = action.payload.data;
      })
      .addCase(fetchTestDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update test
      .addCase(updateTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTest.fulfilled, (state, action) => {
        state.loading = false;
        // If we have data in the response, update the currentTest
        if (action.payload && action.payload.data) {
          state.currentTest = action.payload.data;
        }
        
        // If this test is in our tests array, update it there too
        if (state.tests.length > 0 && action.payload.testId) {
          const index = state.tests.findIndex(t => t.id === action.payload.testId);
          if (index !== -1 && action.payload.data) {
            state.tests[index] = action.payload.data;
          }
        }
      })
      .addCase(updateTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch test results
      .addCase(fetchTestResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestResults.fulfilled, (state, action) => {
        state.loading = false;
        state.allTestResults = action.payload;
      })
      .addCase(fetchTestResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete test
      .addCase(deleteTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted test from the tests array
        state.tests = state.tests.filter(test => test.id !== action.payload.testId);
        state.currentTest = null; // Clear current test if it was deleted
      })
      .addCase(deleteTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectTeacherTests = (state) => state.teacherTests;
export default teacherTestSlice.reducer;