import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { resendOTPEmail, getOTPByEmail, deleteOTPByEmail } from '../store/authSlice';
import { toast } from 'react-toastify';
import Footer from "../components/Footer";

const FillOtp = () => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const [hasSentOTP, setHasSentOTP] = useState(false);
    const isMounted = useRef(true);
    const hasInitialized = useRef(false);

    useEffect(() => {
        // Prevent double initialization
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        if (!email) {
            toast.error('Email not found. Please start over.');
            navigate('/fill-email');
            return;
        }

        const sendOTP = async () => {
            if (hasSentOTP || isLoading || !isMounted.current) return;

            try {
                setIsLoading(true);
                await dispatch(resendOTPEmail(email)).unwrap();
                if (isMounted.current) {
                    setHasSentOTP(true);
                }
            } catch (error) {
                if (isMounted.current) {
                    console.error('Failed to send OTP:', error);
                    navigate('/fill-email');
                }
            } finally {
                if (isMounted.current) {
                    setIsLoading(false);
                }
            }
        };

        sendOTP();

        return () => {
            isMounted.current = false;
        };
    }, []);  // Empty dependency array since we use hasInitialized ref

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Email not found. Please start over.');
            navigate('/fill-email');
            return;
        }

        try {
            setIsVerifying(true);
            const response = await dispatch(getOTPByEmail(email)).unwrap();
            // console.log('OTP fetched:', response.data);
            if (response.data.otp_code === otp) {
                await dispatch(deleteOTPByEmail(email)).unwrap();
                toast.success('OTP verified successfully');
                navigate(`/reset-password?email=${encodeURIComponent(email)}`);
            } else {
                toast.error('Invalid OTP');
            }
        } catch (error) {
            console.error('OTP verification failed:', error);
        } finally {
            setIsVerifying(false);
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
                            disabled={isVerifying}
                            className={`w-full py-2 px-4 ${
                                isVerifying ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'
                            } text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                        >
                            {isVerifying ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FillOtp;
