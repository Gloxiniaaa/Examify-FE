// ViewResults.jsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestResults, selectTeacherTests } from "../store/teacherTestSlice"; // Adjust path as needed
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const ViewResults = () => {
  const { testId, title } = useParams();
  const dispatch = useDispatch();
  const { allTestResults, loading, error } = useSelector(selectTeacherTests);

  useEffect(() => {
    dispatch(fetchTestResults(testId));
  }, [dispatch, testId]);


  return (
    <div className="min-h-screen bg-neutral-50">
      {/* NavBar */}
      <Navbar  />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Section */}
        <section>
          <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
            Result of {title}
          </h3>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <p className="p-4 text-neutral-600">Loading results...</p>
            ) : error ? (
              <p className="p-4 text-red-500">Error: {error}</p>
            ) : !allTestResults || allTestResults.length === 0 ? (
              <p className="p-4 text-neutral-600 text-center">No results available.</p>
            ) : (
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="text-left p-4 text-neutral-800">Student ID</th>
                    <th className="text-left p-4 text-neutral-800">Student Name</th>
                    <th className="text-left p-4 text-neutral-800">Score</th>
                    <th className="text-left p-4 text-neutral-800">Start Time</th>
                    <th className="text-left p-4 text-neutral-800">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {allTestResults.map((result) => (
                    <tr
                      key={result.studentID}
                      className="border-t border-neutral-600 hover:bg-accent"
                    >
                      <td className="p-4 text-neutral-600">{result.studentID}</td>
                      <td className="p-4 text-neutral-600">{result.studentName}</td>
                      <td className="p-4 text-neutral-600">{result.totalScore}</td>
                      <td className="p-4 text-neutral-600">
                        {new Date(result.startTime).toLocaleString()}
                      </td>
                      <td className="p-4 text-neutral-600">
                        {new Date(result.endTime).toLocaleString()}
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

export default ViewResults;