import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Singup";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateTest from "./pages/CreateTest";
import ViewResults from "./pages/ViewResults";
import NotFoundPage from "./pages/404NotFoundPage";
import React from "react";

// Authentication utility
const isTokenValid = () => {
  const token = localStorage.getItem("token");
  return !!token; // Returns true if token exists
};

const getUserRole = () => {
  return localStorage.getItem("userRole") || null;
};

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = isTokenValid();
  const userRole = getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/notfound" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student Protected Routes */}
        <Route path="/student" element={
          <ProtectedRoute requiredRole="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        } />

        {/* Teacher Protected Routes */}
        <Route path="/teacher" element={
          <ProtectedRoute requiredRole="TEACHER">
            <TeacherDashboard />
          </ProtectedRoute>
        } />
        <Route path="/create" element={
          <ProtectedRoute requiredRole="TEACHER">
            <CreateTest />
          </ProtectedRoute>
        } />
        <Route path="/teacher/results/:testId/:title" element={
          <ProtectedRoute requiredRole="TEACHER">
            <ViewResults />
          </ProtectedRoute>
        } />

        {/* 404 Page */}
        <Route path="*" element={<Navigate to="/notfound" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={1000} />
    </Router>
  );
}

export default App;
