import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from "../components/Footer";

const FillEmail = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate(`/fill-otp?email=${encodeURIComponent(email)}`);
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
                        <Link to="/login" className="text-primary hover:text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <h2 className="text-2xl font-bold text-center flex-grow">Forgot Password</h2>
                        <div className="w-6"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium">Email address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Send OTP
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FillEmail;
