import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createTest = async (testData) => {
  try {
    const apiUrl = "http://localhost:5000/tests";

    const response = await fetch(apiUrl, {
      method: "POST",
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
