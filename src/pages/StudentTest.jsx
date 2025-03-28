// StudentTest.jsx
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const StudentTest = () => {
  const { state } = useLocation(); // Get test info passed from StudentDashboard
  const navigate = useNavigate();
  const studentId = localStorage.getItem("userId");
  const testInfo = state?.testInfo;
  const handleStartTest = () => {
    if (testInfo) {
      // Navigate to the actual test-taking page (adjust path as needed)
      navigate(`/student/taketest/${testInfo.passcode}`, {
        state: { testInfo1: testInfo },
      });
    }
  };

  // If no test info is passed, redirect back to dashboard or show error
  if (!testInfo) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <NavBar  />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-red-500">No test information available. Please enter a valid passcode.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <NavBar isAuthenticated={true} userRole="student" onLogout={() => console.log("Logging out...")} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Test Information Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Test Information
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-neutral-600 mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={testInfo.title}
                  disabled
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-2 font-medium">Duration (minutes)</label>
                <input
                  type="number"
                  value={testInfo.testtime}
                  disabled
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-2 font-medium">Time Open</label>
                <input
                  type="text"
                  value={new Date(testInfo.timeopen).toLocaleString()}
                  disabled
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-2 font-medium">Time Close</label>
                <input
                  type="text"
                  value={new Date(testInfo.timeclose).toLocaleString()}
                  disabled
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-2 font-medium">Passcode</label>
                <input
                  type="text"
                  value={testInfo.passcode}
                  disabled
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-2 font-medium">Number of Questions</label>
                <input
                  type="number"
                  value={testInfo.numberquestion}
                  disabled
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-neutral-600 mb-2 font-medium">Description</label>
              <textarea
                value={testInfo.description}
                disabled
                className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
                rows="4"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleStartTest}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
              >
                Take Test
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StudentTest;