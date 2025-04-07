// UserProfile.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "react-feather"; // Add this import
import {
  fetchUserInfo,
  selectUser,
  updateUserInfo,
  changePassword,
} from "../store/userSlice";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const UserProfile = () => {
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector(selectUser);

  // Form states
  const [isEditMode, setIsEditMode] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    email: "",
    date_of_birth: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    username: localStorage.getItem("username") || "",
    oldPassword: "",
    newPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    dispatch(fetchUserInfo(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (userInfo) {
      setUpdateForm({
        name: userInfo.name || "",
        email: userInfo.email || "",
        date_of_birth: userInfo.date_of_birth || "",
      });
    }
  }, [userInfo]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      updateUserInfo({ userId, updateData: updateForm })
    );
    if (!result.error) {
      await dispatch(fetchUserInfo(userId));
      setIsEditMode(false);
      toast.success("Profile updated successfully!");
    } else {
      toast.error(result.payload || "Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.username
    ) {
      toast.error("Please fill in all password fields");
      return;
    }

    const result = await dispatch(
      changePassword({
        username: passwordForm.username,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      })
    );

    if (result.error) {
      toast.error(result.error.message || "Failed to change password");
    } else {
      setShowPasswordForm(false);
      setPasswordForm((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
      }));
      toast.success("Password changed successfully!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-neutral-600">Loading user profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-16">
        {!userInfo ? (
          <p className="text-neutral-600 text-center">
            No user information available.
          </p>
        ) : (
          <>
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <button
                  onClick={handleGoBack}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Go back"
                >
                  <ArrowLeft size={24} className="text-neutral-700" />
                </button>
                <h2 className="text-3xl font-bold text-neutral-800">
                  User Profile
                </h2>
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isEditMode ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                {!isEditMode ? (
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
                          {userInfo.name
                            ? userInfo.name.charAt(0).toUpperCase()
                            : "?"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={updateForm.name}
                        onChange={(e) =>
                          setUpdateForm({ ...updateForm, name: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={updateForm.email}
                        onChange={(e) =>
                          setUpdateForm({
                            ...updateForm,
                            email: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={updateForm.date_of_birth}
                        onChange={(e) =>
                          setUpdateForm({
                            ...updateForm,
                            date_of_birth: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                  </form>
                )}
              </div>
            </section>

            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-neutral-800">
                  Change Password
                </h3>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {showPasswordForm ? "Cancel" : "Change Password"}
                </button>
              </div>

              {showPasswordForm && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        value={passwordForm.username}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-gray-100"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Old Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.oldPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            oldPassword: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
