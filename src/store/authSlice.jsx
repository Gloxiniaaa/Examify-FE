import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const addStudent = async (studentDTO) => {
    // console.log(studentDTO);
    try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BE_API_URL}/api/v1/Student/addStudent`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentDTO)
        });
        if (!response.ok) {
            throw new Error(`Failed to add student. HTTP status: ${response.status}`);
        }
        toast.success("Tạo tài khoản thành công");
        localStorage.removeItem('email')
    } catch (error) {
        console.error('Error adding student', error);
        toast.error("Tạo tài khoản không thành công");
        localStorage.removeItem('email')
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