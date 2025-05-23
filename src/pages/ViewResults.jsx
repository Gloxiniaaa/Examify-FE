// ViewResults.jsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestResults, selectTeacherTests } from "../store/teacherTestSlice"; // Adjust path as needed
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft icon

const ViewResults = () => {
  const { testId, title } = useParams();
  const dispatch = useDispatch();
  const { allTestResults, loading, error } = useSelector(selectTeacherTests);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTestResults(testId));
  }, [dispatch, testId]);

  const handleViewDetails = (testId, studentId) => {
    navigate(`/tests/${testId}/students/${studentId}/results`);
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back to previous page
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* NavBar */}
      <Navbar />
      
      {/* Main Content - sẽ tự động co giãn chiếm chỗ trống */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={handleGoBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Go back"
          >
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <h2 className="text-3xl font-bold text-neutral-800">Results</h2>
        </div>
        
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
                    <th className="text-left p-4 text-neutral-800">Action</th>
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
                      <td className="p-4">
                        <button
                          onClick={() => handleViewDetails(testId, result.studentID)}
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
      
      {/* Footer sẽ tự động được đẩy xuống dưới cùng */}
      <Footer />
    </div>
  );
};

export default ViewResults;