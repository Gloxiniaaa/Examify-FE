// Login.jsx
import { useState } from "react";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here (e.g., API call)
    console.log("Login attempt with:", { email, password });
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-primary">Examify</h1>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6 text-center">
            Login
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-neutral-600 mb-2 font-medium"
              >
                Email
              </label>
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
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-neutral-600 mb-2 font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-neutral-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default Login;
