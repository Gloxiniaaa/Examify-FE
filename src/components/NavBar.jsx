import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Thêm Link
import profileTeacher from "../assets/rock.jpg";
import profileStudent from "../assets/v.jpg";

const NavBar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userRole = localStorage.getItem("userRole"); // Lấy vai trò từ localStorage

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // Hàm toggle dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Hình ảnh và liên kết profile dựa trên vai trò
  const profileImage = userRole === "TEACHER" ? profileTeacher : profileStudent;
  const profileLink = userRole === "TEACHER" ? "/teacher/profile" : "/student/profile";

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Điều hướng đến trang chủ khi nhấn "Examify" */}
        <Link to="/home" className="text-2xl font-bold text-primary">
          Examify
        </Link>
        <div className="flex items-center">
          {userRole ? (
            <div className="relative">
              <img
                src={profileImage}
                alt={userRole}
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={toggleDropdown}
              />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                  <a
                    href={profileLink}
                    className="block px-4 py-2 text-neutral-600 hover:bg-gray-100"
                  >
                    Thông tin {userRole === "TEACHER" ? "giáo viên" : "sinh viên"}
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-neutral-600 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="text-neutral-600 hover:text-primary">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;