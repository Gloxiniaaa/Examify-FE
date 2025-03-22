// TeacherDashboard.jsx
import { useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([
    {
      id: 1,
      title: "Math Quiz 1",
      passcode: "MATH123",
      date: "2025-03-20",
      studentCount: 25,
    },
    {
      id: 2,
      title: "Science Test",
      passcode: "SCI456",
      date: "2025-03-22",
      studentCount: 20,
    },
  ]);

  const [newTest, setNewTest] = useState({ title: "", passcode: "" });

  // const handleLogout = () => {
  //   // Add your logout logic here
  //   console.log("Logging out...");
  // };

  const handleCreateTest = (e) => {
    e.preventDefault();
    if (!newTest.title || !newTest.passcode) {
      alert("Please fill in all fields");
      return;
    }
    const test = {
      id: tests.length + 1,
      title: newTest.title,
      passcode: newTest.passcode,
      date: new Date().toISOString().split("T")[0], // Current date
      studentCount: 0,
    };
    setTests([...tests, test]);
    setNewTest({ title: "", passcode: "" });
    // In a real app, this would be an API call
    navigate('/create');
    console.log("Created new test:", test);
  };

  const handleViewResults = (testId, title) => {
    navigate(`/teacher/results/${testId}/${encodeURIComponent(title)}`); 
    console.log(`Viewing results for test ${testId}: ${title}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Examify - Teacher</h1>
          <button className="text-neutral-600 hover:text-primary">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">
            Welcome, [Teacher Name]
          </h2>
          <p className="text-neutral-600">
            Manage your tests and view student results
          </p>
        </section>

        {/* Create New Test */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
            Create New Test
          </h3>
          <form
            onSubmit={handleCreateTest}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="testTitle"
                  className="block text-neutral-600 mb-2 font-medium"
                >
                  Test Title
                </label>
                <input
                  type="text"
                  id="testTitle"
                  value={newTest.title}
                  onChange={(e) =>
                    setNewTest({ ...newTest, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter test title"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="passcode"
                  className="block text-neutral-600 mb-2 font-medium"
                >
                  Passcode
                </label>
                <input
                  type="text"
                  id="passcode"
                  value={newTest.passcode}
                  onChange={(e) =>
                    setNewTest({ ...newTest, passcode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter unique passcode"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition"
            >
              Create Test
            </button>
          </form>
        </section>

        {/* Existing Tests */}
        <section>
          <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
            Your Tests
          </h3>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-accent">
                <tr>
                  <th className="text-left p-4 text-neutral-800">Test Title</th>
                  <th className="text-left p-4 text-neutral-800">Passcode</th>
                  <th className="text-left p-4 text-neutral-800">Date</th>
                  <th className="text-left p-4 text-neutral-800">Students</th>
                  <th className="text-left p-4 text-neutral-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr
                    key={test.id}
                    className="border-t border-neutral-600 hover:bg-accent"
                  >
                    <td className="p-4 text-neutral-600">{test.title}</td>
                    <td className="p-4 text-neutral-600">{test.passcode}</td>
                    <td className="p-4 text-neutral-600">{test.date}</td>
                    <td className="p-4 text-neutral-600">
                      {test.studentCount}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleViewResults(test.id, test.title)}
                        className="text-primary hover:underline"
                      >
                        View Results
                      </button>
                    </td>
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

export default TeacherDashboard;
