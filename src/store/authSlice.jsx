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
        
        toast.success("Tạo tài khoản thành công");
        localStorage.removeItem('email');
        return { success: true };
    } catch (error) {
        console.error('Error adding user:', error.message);
        toast.error(`Đăng ký không thành công: ${error.message}`);
        localStorage.removeItem('email');
        return { success: false, error: error.message };
    }
}

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
    }
});

export const { sendEmail, saveRegisterInfor } = authSlice.actions;
export const selectAuth = (state) => state.authentication;
export default authSlice.reducer;