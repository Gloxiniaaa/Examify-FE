import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Singup";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateTest from "./pages/CreateTest";
import ViewResults from "./pages/ViewResults";
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
    if (userRole === "ADMIN" && requiredRole === "USER") {
      return children;
    }
    return <Navigate to="/notfound" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element ={<Login></Login>} ></Route>
        <Route path="/signup" element ={<Signup></Signup>} ></Route>
        <Route path="/student" element={<StudentDashboard></StudentDashboard>} />
        <Route path="/account" element ={<TeacherDashboard></TeacherDashboard>} ></Route>
        <Route path="/create" element ={<CreateTest></CreateTest>} ></Route>
        <Route path="/teacher/results/:testId/:title" element ={<ViewResults></ViewResults>} ></Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={1000} />
    </Router>
  );
}

export default App;