// StudentDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPastTestResults, selectStudentTests } from "../store/studentTestSlice"; // Adjust path as needed
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const StudentDashboard = () => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pastResults, loading: resultsLoading, error: resultsError } = useSelector(selectStudentTests);

  // Mock student ID - in a real app, get this from auth context or user profile
  const studentId = localStorage.getItem("userId"); // Replace with actual student ID from auth

  // Fetch past test results on component mount
  useEffect(() => {
    dispatch(fetchPastTestResults(studentId));
  }, [dispatch, studentId]);

  const handleJoinTest = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BE_API_URL}/students/tests?passcode=${passcode}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok && result.status === "OK") {
        // Navigate to StudentTest page with test data
        navigate(`/student/test/${passcode}`, {
          state: { testInfo: result.data },
        });
      } else {
        setError(result.message || "Invalid passcode. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while fetching test info. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (testId) => {
    navigate(`/results/${testId}`); // Navigate to result details page
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">
            Welcome, [Student Name]
          </h2>
          <p className="text-neutral-600">
            Enter a passcode to join a test or view your past results.
          </p>
        </section>

        {/* Enter Code to Join Test Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
            Enter Code to Join Test
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError("");
                }}
                placeholder="Enter passcode"
                className="flex-grow px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
              <button
                onClick={handleJoinTest}
                disabled={loading}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition disabled:bg-gray-400"
              >
                {loading ? "Loading..." : "Visit Test"}
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </section>

        {/* Past Results */}
        <section>
          <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
            Your Past Results
          </h3>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {resultsLoading ? (
              <p className="p-4 text-neutral-600">Loading past results...</p>
            ) : resultsError ? (
              <p className="p-4 text-red-500">Error: {resultsError}</p>
            ) : pastResults.length === 0 ? (
              <p className="p-4 text-neutral-600 text-center">No past results available.</p>
            ) : (
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="text-left p-4 text-neutral-800">Test Title</th>
                    <th className="text-left p-4 text-neutral-800">Total Score</th>
                    <th className="text-left p-4 text-neutral-800">Start Time</th>
                    <th className="text-left p-4 text-neutral-800">End Time</th>
                    <th className="text-left p-4 text-neutral-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pastResults.map((result) => (
                    <tr
                      key={result.testid}
                      className="border-t border-neutral-600 hover:bg-accent"
                    >
                      <td className="p-4 text-neutral-600">{result.title}</td>
                      <td className="p-4 text-neutral-600">{result.totalscore}</td>
                      <td className="p-4 text-neutral-600">
                        {new Date(result.starttime).toLocaleString()}
                      </td>
                      <td className="p-4 text-neutral-600">
                        {new Date(result.endtime).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleViewDetails(test.testid)}
                          className="text-primary hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboard;