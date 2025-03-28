import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const NavBar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    navigate("/login");
  };
  const homeLink = userRole === "TEACHER" ? "/teacher" : userRole === "STUDENT" ? "/student" : "/";
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
      <Link to={homeLink} className="text-2xl font-bold text-primary">
          Examify
        </Link>
        <button onClick={handleLogout} className="text-neutral-600 hover:text-primary">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
