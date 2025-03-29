import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Singup";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateTest from "./pages/CreateTest";
import ViewResults from "./pages/ViewResults";

import PropTypes from "prop-types";

import TeacherTestDetails from "./pages/TeacherTestDetails";
import StudentTest from "./pages/StudentTest";
import NotFoundPage from "./pages/404NotFoundPage";
import StudentTakeTest from "./pages/StudentTakeTest";
import ViewSubmission from "./pages/ViewSubmission";
import UserProfile from "./pages/UserProfile";

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
  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    requiredRole: PropTypes.string,
  };
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
        <Route path="/notfound" element={<NotFoundPage></NotFoundPage>} />
        <Route path="/profile" element={<UserProfile></UserProfile>} />


        {/* Student Protected Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/test/:passcode"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/taketest/:passcode"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentTakeTest />
            </ProtectedRoute>
          }
        />
        {/* Teacher Protected Routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute requiredRole="TEACHER">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute requiredRole="TEACHER">
              <CreateTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/results/:testId"
          element={
            <ProtectedRoute requiredRole="TEACHER">
              <ViewResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/testdetails/:testId"
          element={
            <ProtectedRoute requiredRole="TEACHER">
              <TeacherTestDetails/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tests/:testId/students/:studentId/results"
          element={
              <ViewSubmission/>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<Navigate to="/notfound" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={1000} />
    </Router>
  );
}

export default App;
