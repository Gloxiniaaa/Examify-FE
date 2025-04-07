// userSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch user information
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (userId, { rejectWithValue }) => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_REACT_APP_BE_API_URL
      }/users/${userId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user information");
      }

      const data = await response.json();
      if (data.status !== "OK") {
        throw new Error(data.message || "Failed to fetch user information");
      }

      return data.data; // Return the data object containing user info
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update user information
export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async ({ userId, updateData }, { rejectWithValue }) => {
    try {
      const apiUrl = `${import.meta.env.VITE_REACT_APP_BE_API_URL}/users/${userId}`;
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user information");
      }

      const data = await response.json();
      if (data.status !== "OK") {
        throw new Error(data.message || "Failed to update user information");
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to change password
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (changePasswordData, { rejectWithValue }) => {
    try {
      const apiUrl = `${import.meta.env.VITE_REACT_APP_BE_API_URL}/users/change-password`;
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: changePasswordData.username,
          oldPassword: changePasswordData.oldPassword,
          newPassword: changePasswordData.newPassword
        }),
      });

      const data = await response.json();
      
      if (data.status !== "OK") {
        return rejectWithValue(data.message || "Failed to change password");
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to create new account
export const createAccount = createAsyncThunk(
  "user/createAccount",
  async (newAccountData, { rejectWithValue }) => {
    try {
      const apiUrl = `${import.meta.env.VITE_REACT_APP_BE_API_URL}/users`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: newAccountData.username,
          password: newAccountData.password,
          role: newAccountData.role,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
      }

      const data = await response.json();
      if (data.status !== "OK") {
        throw new Error(data.message || "Failed to create account");
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null, // To store user information
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectUser = (state) => state.user;
export default userSlice.reducer;