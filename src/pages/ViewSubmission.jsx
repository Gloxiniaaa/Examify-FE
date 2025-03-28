// ViewSubmission.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubmissionDetails, selectSubmissions } from "../store/submissionSlice"; // Adjust path as needed
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

const ViewSubmission = () => {
  const { testId, studentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { submission, loading, error } = useSelector(selectSubmissions);
  const [openQuestions, setOpenQuestions] = useState([]); // Track which questions are expanded

  useEffect(() => {
    dispatch(fetchSubmissionDetails({ testId, studentId }));
  }, [dispatch, testId, studentId]);

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/login");
  };

  const toggleQuestion = (questionId) => {
    if (openQuestions.includes(questionId)) {
      setOpenQuestions(openQuestions.filter((id) => id !== questionId));
    } else {
      setOpenQuestions([...openQuestions, questionId]);
    }
  };

  const toggleAllQuestions = () => {
    if (openQuestions.length === submission.questions.length) {
      setOpenQuestions([]); // Collapse all
    } else {
      setOpenQuestions(submission.questions.map((q) => q.id)); // Expand all
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar isAuthenticated={true} userRole="teacher" onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-neutral-600">Loading submission details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar isAuthenticated={true} userRole="teacher" onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-red-500">Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!submission || !submission.result || !submission.questions) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar isAuthenticated={true} userRole="teacher" onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-neutral-600">No submission data available.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const {title, result, questions } = submission;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar isAuthenticated={true} userRole="teacher" onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Submission Summary */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Submission Details
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-neutral-600">
                  <strong>Title</strong> {title}
                </p>
                <p className="text-neutral-600">
                  <strong>Total Score:</strong> {result.totalscore.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-neutral-600">
                  <strong>Start Time:</strong>{" "}
                  {new Date(result.starttime).toLocaleString()}
                </p>
                <p className="text-neutral-600">
                  <strong>End Time:</strong>{" "}
                  {new Date(result.endtime).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Questions and Answers with Accordion */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-neutral-800">
              Questions and Answers
            </h3>
            <button
              onClick={toggleAllQuestions}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition"
            >
              {openQuestions.length === questions.length ? "Collapse All" : "Expand All"}
            </button>
          </div>
          {questions.length === 0 ? (
            <p className="text-neutral-600">No questions to display.</p>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleQuestion(question.id)}
                    className="w-full flex justify-between items-center p-6 text-left bg-accent hover:bg-gray-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <h4 className="text-md font-semibold text-neutral-800">
                        Question {question.id}: {question.content}
                      </h4>
                      <span
                        className={`text-1xl ${
                          question.iscorrect ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {question.iscorrect ? "✅" : "❌"}
                      </span>
                    </div>
                    <span className="text-neutral-600">
                      {openQuestions.includes(question.id) ? "▲" : "▼"}
                    </span>
                  </button>
                  {openQuestions.includes(question.id) && (
                    <div className="p-6">
                      <p className="text-neutral-600 mb-2">
                        <strong>Score:</strong> {question.score}
                      </p>
                      <div className="space-y-2">
                        {question.answers.map((answer) => {
                          const isCorrect = answer.iscorrect;
                          const isSelected = answer.id === question.answerid;
                          return (
                            <div
                              key={answer.id}
                              className={`p-2 rounded-md ${
                                isCorrect ? "bg-green-100 text-green-800" : "text-neutral-600"
                              }`}
                            >
                              {answer.content}
                              {isSelected && " (selected)"}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ViewSubmission;