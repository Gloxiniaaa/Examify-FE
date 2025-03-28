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
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("An error occurred while logging in.");
      console.error('Error:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Redirect to Google OAuth endpoint
      window.location.href = `${import.meta.env.VITE_REACT_APP_BE_API_URL}/oauth2/authorization/google`;
    } catch (error) {
      toast.error("An error occurred with Google sign-in.");
      console.error('Error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 bg-white shadow-sm">
        {/* <h1 className="text-2xl font-bold text-primary">Examify</h1> */}
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-bold text-primary">
            Examify
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          
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
          
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#4285F4"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
          
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