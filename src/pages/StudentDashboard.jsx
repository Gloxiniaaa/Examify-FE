// StudentDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const StudentDashboard = () => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock past results - in a real app, fetch from API
  const [pastResults] = useState([
    { id: 1, title: "Math Quiz 1", score: "85/100", date: "2025-03-15" },
    { id: 2, title: "History Test", score: "92/100", date: "2025-03-10" },
  ]);

  const handleJoinTest = async () => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = `${
        import.meta.env.VITE_REACT_APP_BE_API_URL
      }/students/tests?passcode=${passcode}`;
      const response = await fetch(apiUrl, {
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

  return (
    <div className="min-h-screen bg-neutral-50">
      <NavBar />

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
            <table className="w-full">
              <thead className="bg-accent">
                <tr>
                  <th className="text-left p-4 text-neutral-800">Test Title</th>
                  <th className="text-left p-4 text-neutral-800">Score</th>
                  <th className="text-left p-4 text-neutral-800">Date</th>
                </tr>
              </thead>
              <tbody>
                {pastResults.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="p-4 text-neutral-600 text-center"
                    >
                      No past results available.
                    </td>
                  </tr>
                ) : (
                  pastResults.map((result) => (
                    <tr
                      key={result.id}
                      className="border-t border-neutral-600 hover:bg-accent"
                    >
                      <td className="p-4 text-neutral-600">{result.title}</td>
                      <td className="p-4 text-neutral-600">{result.score}</td>
                      <td className="p-4 text-neutral-600">{result.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
