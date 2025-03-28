// TeacherDashboard.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeacherTests,
  selectTeacherTests,
} from "../store/teacherTestSlice";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tests, loading, error } = useSelector(selectTeacherTests);

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

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* NavBar */}
      <NavBar />

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
          <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
            Your Tests
          </h3>
          {loading ? (
            <p className="text-neutral-600">Loading tests...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : tests.length === 0 ? (
            <p className="text-neutral-600">No tests found.</p>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="text-left p-4 text-neutral-800">Title</th>
                    <th className="text-left p-4 text-neutral-800">Passcode</th>
                    <th className="text-left p-4 text-neutral-800">Duration</th>
                    <th className="text-left p-4 text-neutral-800">Time Open</th>
                    <th className="text-left p-4 text-neutral-800">Time Close</th>
                    <th className="text-left p-4 text-neutral-800">Details</th>
                    <th className="text-left p-4 text-neutral-800">Student</th>
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
