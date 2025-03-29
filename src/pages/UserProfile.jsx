// UserProfile.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, selectUser } from "../store/userSlice"; // Adjust path as needed
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

const UserProfile = () => {
  const userId  = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector(selectUser);

  useEffect(() => {
    console.log(userId);
    dispatch(fetchUserInfo(userId));
  }, [dispatch, userId]);


  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar  />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-neutral-600">Loading user profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar  />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-red-500">Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-neutral-600">No user information available.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar  />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* User Profile Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            User Profile
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-neutral-600 mb-4">
                  <strong>Name:</strong> {userInfo.name}
                </p>
                <p className="text-neutral-600 mb-4">
                  <strong>Email:</strong> {userInfo.email}
                </p>
                <p className="text-neutral-600">
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(userInfo.date_of_birth).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-neutral-600">
                  <span className="text-2xl">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;