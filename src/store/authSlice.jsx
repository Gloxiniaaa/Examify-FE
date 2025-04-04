import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const addUser = async (userDTO) => {
    try {
        
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BE_API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({
                username: userDTO.username,
                password: userDTO.password,
                role: userDTO.role || 'STUDENT'
            })
        });
        
        const data = await response.json().catch(() => ({}));
        
        if (!response.ok) {
            throw new Error(`Failed to add user. HTTP status: ${response.status}. ${data.message || ''}`);
        }
        
        localStorage.removeItem('email');
        return { success: true };
    } catch (error) {
        console.error('Error adding user:', error.message);
        toast.error(`Đăng ký không thành công: ${error.message}`);
        localStorage.removeItem('email');
        return { success: false, error: error.message };
    }
}

export const sendOTPEmail = createAsyncThunk(
    'auth/sendOTPEmail',
    async (email, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BE_API_URL}/api/v1/Email/sendEmail?toGmail=${email}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Send OTP Error:', error);
            if (error.message === 'Failed to fetch') {
                return rejectWithValue('Unable to connect to the server. Please check your connection and try again.');
            }
            return rejectWithValue(error.message);
        }
    }
);

export const getOTPByEmail = createAsyncThunk(
    'auth/getOTPByEmail',
    async (email) => {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BE_API_URL}/api/v1/Email/getOTPByEmail/${email}`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data;
    }
);

export const deleteOTPByEmail = createAsyncThunk(
    'auth/deleteOTPByEmail',
    async (email) => {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BE_API_URL}/api/v1/Email/deleteOTPByEmail/${email}`, {
            method: 'PUT',
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data;
    }
);

export const updatePassword = createAsyncThunk(
    'auth/updatePassword',
    async (updatePasswordDTO) => {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BE_API_URL}/users/update-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(updatePasswordDTO)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data;
    }
);

const authSlice = createSlice({
    name: 'authentication',
    initialState: {
        isLoading: true,
        email: null,
        studentDTO: [],
        error: null,
    },
    reducers: {
        sendEmail: (state, action) => {
            const email = action.payload;
            state.email = email;
            localStorage.setItem('email', email);
            sendOTPByEmail(email);  
        },
        saveRegisterInfor: (state, action) => {
            state.studentDTO = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendOTPEmail.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(sendOTPEmail.fulfilled, (state) => {
                state.isLoading = false;
                toast.success('OTP sent successfully');
            })
            .addCase(sendOTPEmail.rejected, (state, action) => {
                state.isLoading = false;
                const errorMessage = action.payload || 'Failed to send OTP. Please try again later.';
                toast.error(errorMessage);
            })
            .addCase(updatePassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updatePassword.fulfilled, (state) => {
                state.isLoading = false;
                toast.success('Password updated successfully');
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(`Failed to update password: ${action.error.message}`);
            });
    }
});

export const { sendEmail, saveRegisterInfor } = authSlice.actions;
export const selectAuth = (state) => state.authentication;
export default authSlice.reducer;