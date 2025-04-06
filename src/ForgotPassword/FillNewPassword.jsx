import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { updatePassword } from '../store/authSlice';
import { toast } from 'react-toastify';
import Footer from "../components/Footer";

const FillNewPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const username = localStorage.getItem('username');
        if (!username) {
            toast.error('No username found. Please start the password reset process again');
            navigate('/forgot-password');
            return;
        }

        const result = await dispatch(updatePassword({
            username: username,
            newPassword: formData.newPassword
        }));

        if (updatePassword.fulfilled.match(result)) {
            localStorage.removeItem('username');
            navigate('/login');
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
                        <Link to="/fill-otp" className="text-primary hover:text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <h2 className="text-2xl font-bold text-center flex-grow">Reset Password</h2>
                        <div className="w-6"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="newPassword" className="block text-sm font-medium">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="newPassword"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                    className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Enter new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                >
                                    {showPassword ? <span className="h-5 w-5">👁️</span> : <span className="h-5 w-5">👁️‍🗨️</span>}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FillNewPassword;
