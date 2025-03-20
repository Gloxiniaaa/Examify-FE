import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Singup";
import TeacherDashboard from "./pages/TeacherDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element ={<Login></Login>} ></Route>
        <Route path="/signup" element ={<Signup></Signup>} ></Route>
        <Route path="/student" element={<StudentDashboard></StudentDashboard>} />
        <Route path="/teacher" element ={<TeacherDashboard></TeacherDashboard>} ></Route>
      </Routes>
    </Router>
  );
}

export default App;