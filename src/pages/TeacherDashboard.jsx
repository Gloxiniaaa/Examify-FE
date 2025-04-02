// TeacherDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeacherTests,
  selectTeacherTests,
} from "../store/teacherTestSlice";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Search } from "lucide-react";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tests, loading, error } = useSelector(selectTeacherTests);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const teacherId = localStorage.getItem("userId");
    dispatch(fetchTeacherTests(teacherId));
  }, [dispatch]);

  const handleCreateTest = () => {
    navigate("/create");
  };

  const handleViewResults = (testId) => {
    navigate(`/teacher/results/${testId}`);
  };

  const handleViewDetails = (testId) => {
    navigate(`/teacher/testdetails/${testId}`);
  };

  // Filter tests based on search query
  const filteredTests =
    !tests || searchQuery.trim() === ""
      ? tests || []
      : tests.filter((test) => {
          const query = searchQuery.toLowerCase();
          return (
            test.title.toLowerCase().includes(query) ||
            test.passcode.toLowerCase().includes(query)
          );
        });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* NavBar */}
      <NavBar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">
            Welcome, Teacher
          </h2>
          <p className="text-neutral-600">
            Manage your tests and view student results
          </p>
        </section>

        <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
            Create New Test
          </h3>
          <button
            onClick={handleCreateTest}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition"
          >
            Create Test
          </button>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-neutral-800">
              Your Tests
            </h3>

            {/* Search bar for filtering tests */}
            <div className="relative w-1/3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or passcode..."
                className="w-full px-3 py-2 pl-10 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search
                size={18}
                className="text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-neutral-600">Loading tests...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : !tests || tests.length === 0 ? (
            <p className="text-neutral-600">No tests found.</p>
          ) : !filteredTests || filteredTests.length === 0 ? (
            <p className="text-neutral-600 bg-white p-4 rounded-lg shadow-md text-center">
              No tests match your search criteria.
            </p>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="text-left p-4 text-neutral-800">Title</th>
                    <th className="text-left p-4 text-neutral-800">Passcode</th>
                    <th className="text-left p-4 text-neutral-800">Duration</th>
                    <th className="text-left p-4 text-neutral-800">Time Open</th>
                    <th className="text-left p-4 text-neutral-800">
                      Time Close
                    </th>
                    <th className="text-left p-4 text-neutral-800">Details</th>
                    <th className="text-left p-4 text-neutral-800">Student</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.map((test) => (
                    <tr
                      key={test.id}
                      className="border-t border-neutral-600 hover:bg-accent"
                    >
                      <td className="p-4 text-neutral-600">{test.title}</td>
                      <td className="p-4 text-neutral-600">{test.passcode}</td>
                      <td className="p-4 text-neutral-600">
                        {test.testtime} min
                      </td>
                      <td className="p-4 text-neutral-600">
                        {new Date(test.timeopen).toLocaleString()}
                      </td>
                      <td className="p-4 text-neutral-600">
                        {new Date(test.timeclose).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleViewDetails(test.id)}
                          className="text-primary hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleViewResults(test.id)}
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
          )}
        </section>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default TeacherDashboard;
