import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Footer from "../components/Footer";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BE_API_URL}/api/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.status === "OK") {
        const decodedToken = jwtDecode(data.data);
        const role = decodedToken.role;
        
        localStorage.setItem('token', data.data);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', decodedToken.userId);
  
        // Điều hướng dựa trên vai trò
        if (role === "TEACHER") {
          navigate('/teacher');
        } else if (role === "STUDENT") {
          navigate('/student');
        } else {
          navigate('/account'); // Mặc định nếu không xác định được role
        }
      } else if (data.status === "ERROR") {
        toast.error("Login failed. Please check your informations.");
      }
    } catch (error) {
      toast.error("An error occurred while logging in.");
      console.error('Error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
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
            <Link to="/" className="text-primary hover:text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h2 className="text-2xl font-bold text-center flex-grow">Login</h2>
            <div className="w-6"></div> {/* Empty div for balanced spacing */}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? <span className="h-5 w-5">👁️</span> : <span className="h-5 w-5">👁️‍🗨️</span>}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Login
            </button>
          </form>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account? <a href="/signup" className="font-medium text-primary hover:text-primary-dark">Sign Up</a>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Login;