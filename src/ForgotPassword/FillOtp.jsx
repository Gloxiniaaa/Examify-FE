import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getOTPByEmail, deleteOTPByEmail } from '../store/authSlice';
import { toast } from 'react-toastify';
import Footer from "../components/Footer";

const FillOtp = () => {
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const email = localStorage.getItem('resetEmail');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Email not found. Please start over.');
            navigate('/fill-email');
            return;
        }

        try {
            const response = await dispatch(getOTPByEmail(email)).unwrap();
            if (response.data === otp) {
                await dispatch(deleteOTPByEmail(email)).unwrap();
                toast.success('OTP verified successfully');
                navigate('/reset-password'); // Assuming you have this route
            } else {
                toast.error('Invalid OTP');
            }
        } catch (error) {
            console.error('OTP verification failed:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="py-4 px-6 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        Examify
                    </Link>
                </div>
            </header>
            
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/forgot-password" className="text-primary hover:text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <h2 className="text-2xl font-bold text-center flex-grow">Enter OTP</h2>
                        <div className="w-6"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="otp" className="block text-sm font-medium">OTP Code</label>
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter OTP code"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Verify OTP
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FillOtp;
