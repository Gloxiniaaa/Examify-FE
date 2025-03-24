import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTestDetails,
  updateTest,
  selectTeacherTests,
} from "../store/teacherTestSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TestDetails = () => {
  const { testId } = useParams();
  const dispatch = useDispatch();
  const { currentTest, loading, error } = useSelector(selectTeacherTests);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTest, setEditedTest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchTestDetails(testId));
  }, [dispatch, testId]);

  useEffect(() => {
    if (currentTest) {
      // Deep copy to ensure nested objects are independent
      setEditedTest(JSON.parse(JSON.stringify(currentTest)));
    }
  }, [currentTest]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset to original test data if canceling
      setEditedTest(JSON.parse(JSON.stringify(currentTest)));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name !== "passcode") {
      // Prevent editing passcode
      setEditedTest((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleQuestionChange = (index, field, value) => {
    setEditedTest((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    setEditedTest((prev) => {
      const updatedQuestions = [...prev.questions];
      const updatedAnswers = [...updatedQuestions[qIndex].answers];
      updatedAnswers[oIndex] = { ...updatedAnswers[oIndex], [field]: value };
      updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], answers: updatedAnswers };
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleSave = async () => {
    try {
      await dispatch(updateTest({ testId, testData: editedTest })).unwrap();
      setIsEditing(false);
    } catch (err) {
      alert("Failed to save changes: " + err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter questions based on content or index
  const filteredQuestions = editedTest?.questions
    ?.map((q, index) => ({ ...q, originalIndex: index }))
    .filter((q) => {
      const query = searchQuery.toLowerCase();
      const indexStr = (q.originalIndex + 1).toString(); // 1-based index for display
      return (
        q.content.toLowerCase().includes(query) ||
        indexStr.includes(query)
      );
    }) || [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!currentTest || !editedTest) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar></Navbar>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-neutral-800">Test Details</h2>
          <button
            onClick={handleEditToggle}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition"
          >
            {isEditing ? "Cancel" : "Edit Test"}
          </button>
        </div>

        {/* Test Details */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-neutral-600 mb-2 font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={editedTest.title}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-neutral-600 mb-2 font-medium">Duration (minutes)</label>
              <input
                type="number"
                name="testtime"
                value={editedTest.testtime}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-neutral-600 mb-2 font-medium">Time Open</label>
              <input
                type="datetime-local"
                name="timeopen"
                value={editedTest.timeopen.slice(0, 16)}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-neutral-600 mb-2 font-medium">Time Close</label>
              <input
                type="datetime-local"
                name="timeclose"
                value={editedTest.timeclose.slice(0, 16)}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-neutral-600 mb-2 font-medium">Passcode</label>
              <input
                type="text"
                name="passcode"
                value={editedTest.passcode}
                disabled={true}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-neutral-600 mb-2 font-medium">Description</label>
            <textarea
              name="description"
              value={editedTest.description}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows="4"
            />
          </div>
        </div>

        {/* Questions Section with Search Bar */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-neutral-800">Questions</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by question text or number..."
              className="w-1/3 px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {filteredQuestions.length === 0 ? (
            <p className="text-neutral-600">No questions match your search.</p>
          ) : (
            filteredQuestions.map((q) => (
              <div key={q.originalIndex} className="bg-white p-6 rounded-lg shadow-md mb-4">
                <div className="flex items-center mb-4">
                  <span className="text-neutral-800 font-semibold mr-2">
                    Question {q.originalIndex + 1}
                  </span>
                  <input
                    type="text"
                    value={q.content}
                    onChange={(e) => handleQuestionChange(q.originalIndex, "content", e.target.value)}
                    disabled={!isEditing}
                    className="flex-grow px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {q.answers.map((opt, oIndex) => (
                  <div
                    key={oIndex}
                    className={`flex items-center gap-4 mb-2 ${opt.iscorrect ? "text-green-600" : "text-neutral-600"}`}
                  >
                    <input
                      type="text"
                      value={opt.content}
                      onChange={(e) => handleOptionChange(q.originalIndex, oIndex, "content", e.target.value)}
                      disabled={!isEditing}
                      className="flex-grow px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={opt.iscorrect}
                        onChange={(e) => handleOptionChange(q.originalIndex, oIndex, "iscorrect", e.target.checked)}
                        disabled={!isEditing}
                        className="mr-2"
                      />
                      Correct
                    </label>
                  </div>
                ))}
              </div>
            ))
          )}
        </section>

        {/* Save Button (only visible in edit mode) */}
        {isEditing && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </main>
      <Footer></Footer>
    </div>
  );
};

export default TestDetails;