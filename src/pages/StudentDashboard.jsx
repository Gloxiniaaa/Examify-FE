// StudentDashboard.jsx
import { useState } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
const StudentDashboard = () => {
  // Mock data - in a real app, this would come from an API
  const [availableTests] = useState([
    {
      id: 1,
      title: "Math Quiz 1",
      subject: "Mathematics",
      date: "2025-03-20",
      passcode: "MATH123",
    },
    {
      id: 2,
      title: "Science Test",
      subject: "Science",
      date: "2025-03-22",
      passcode: "SCI456",
    },
  ]);

  const [pastResults] = useState([
    { id: 1, title: "Math Quiz 1", score: "85/100", date: "2025-03-15" },
    { id: 2, title: "History Test", score: "92/100", date: "2025-03-10" },
  ]);

  const handleJoinTest = (testId, passcode) => {
    // In a real app, this would validate the passcode and redirect to test
    console.log(`Joining test ${testId} with passcode: ${passcode}`);
    // Add navigation logic here
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* NavBar */}
      <NavBar/>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">
            Welcome, [Student Name]
          </h2>
          <p className="text-neutral-600">
            Here are your available tests and past results
          </p>
        </section>

        {/* Available Tests */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
            Available Tests
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {availableTests.map((test) => (
              <div
                key={test.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h4 className="text-xl font-semibold text-primary mb-2">
                  {test.title}
                </h4>
                <p className="text-neutral-600 mb-2">Subject: {test.subject}</p>
                <p className="text-neutral-600 mb-4">Date: {test.date}</p>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Enter passcode"
                    className="border border-neutral-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => handleJoinTest(test.id, test.passcode)}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition"
                  >
                    Join Test
                  </button>
                </div>
              </div>
            ))}
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
                {pastResults.map((result) => (
                  <tr
                    key={result.id}
                    className="border-t border-neutral-600 hover:bg-accent"
                  >
                    <td className="p-4 text-neutral-600">{result.title}</td>
                    <td className="p-4 text-neutral-600">{result.score}</td>
                    <td className="p-4 text-neutral-600">{result.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default StudentDashboard;
