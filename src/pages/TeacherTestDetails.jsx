import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTestDetails,
  updateTest,
  deleteTest,
  selectTeacherTests,
} from "../store/teacherTestSlice";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { ArrowLeft, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

const TestDetails = () => {
  const { testId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTest, loading, error } = useSelector(selectTeacherTests);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTest, setEditedTest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchTestDetails(testId));
  }, [dispatch, testId]);

  useEffect(() => {
    if (currentTest) {
      // Deep copy to ensure nested objects are independent
      setEditedTest(JSON.parse(JSON.stringify(currentTest)));
    }
  }, [currentTest]);

  const handleGoBack = () => {
    navigate(-1); // Navigate back to previous page
  };

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

  const handleDeleteQuestionConfirm = (questionIndex) => {
    setQuestionToDelete(questionIndex);
    setShowDeleteQuestionModal(true);
  };

  const handleDeleteQuestion = () => {
    if (questionToDelete !== null) {
      setEditedTest((prev) => {
        const updatedQuestions = prev.questions.filter((_, idx) => idx !== questionToDelete);
        return { ...prev, questions: updatedQuestions };
      });
      
      setShowDeleteQuestionModal(false);
      setQuestionToDelete(null);
      toast.success("Question deleted successfully");
    }
  };

  const handleSave = async () => {
    try {
      // Validate that we have at least one question
      if (Number(editedTest.testtime || editedTest.testTime) <= 0) {
        toast.error("Test duration must be a positive number");
        return;
      }
      
      if (editedTest.questions.length === 0) {
        toast.error("Test must contain at least one question");
        return;
      }
      
      // Validate that each question has at least one correct answer
      const invalidQuestions = editedTest.questions.filter(q => 
        !q.answers.some(a => a.iscorrect)
      );
      
      if (invalidQuestions.length > 0) {
        toast.error(`Question ${invalidQuestions[0].id} must have at least one correct answer`);
        return;
      }

      // Create a clean version of the test data to send to the server
      const testToSave = {
        title: editedTest.title,
        id: editedTest.id,
        description: editedTest.description,
        testTime: Number(editedTest.testtime || editedTest.testTime),
        timeOpen: new Date(editedTest.timeopen || editedTest.timeOpen).toISOString(),
        timeClose: new Date(editedTest.timeclose || editedTest.timeClose).toISOString(),
        passcode: editedTest.passcode,
        teacherId: Number(editedTest.teacherid || editedTest.teacherId),
        numberOfQuestion: editedTest.questions.length,
        questions: editedTest.questions.map((q) => ({
          id: q.id,
          content: q.content,
          score: Number(q.score || 1), // Default to 1 if not specified
          answers: q.answers.map((a) => ({
            id: a.id,
            content: a.content,
            isCorrect: a.iscorrect || false, // Ensure boolean
          })),
        })),
        // Add a field to track deleted question IDs if needed by your backend
        deletedQuestionIds: currentTest.questions
          .filter(q => !editedTest.questions.some(eq => eq.id === q.id))
          .map(q => q.id)
      };

      const result = await dispatch(updateTest(testToSave)).unwrap();
      console.log("Update result:", testToSave);
      // After successful update, fetch the latest test data to ensure UI is in sync
      await dispatch(fetchTestDetails(testId));
      
      setIsEditing(false);
      toast.success("Test updated successfully");
    } catch (err) {
      toast.error("Failed to save changes: " + (err.message || err));
    }
  };

  const handleDeleteConfirmation = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteTest = async () => {
    setIsDeleting(true);
    try {
      const result = await dispatch(deleteTest(testId)).unwrap();
      setShowDeleteModal(false);
      toast.success("Test deleted successfully");
      navigate("/teacher"); // Navigate back to the teacher dashboard
    } catch (err) {
      console.error("Delete test error:", err);
      toast.error(`Failed to delete test: ${err.toString()}`);
      setShowDeleteModal(false); // Close the modal even on error
    } finally {
      setIsDeleting(false);
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
      <NavBar></NavBar>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleGoBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Go back"
          >
            <ArrowLeft size={24} className="text-neutral-700" />
          </button>
          <h2 className="text-3xl font-bold text-neutral-800">Test Details</h2>
          <div className="flex-grow"></div>
          <button
            onClick={handleDeleteConfirmation}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition mr-3 flex items-center"
            title="Delete Test"
          >
            <Trash2 size={18} className="mr-1" /> Delete Test
          </button>
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
                min={1}
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
            <h3 className="text-2xl font-semibold text-neutral-800">
              Questions ({editedTest.questions.length})
            </h3>
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
                <div className="flex justify-between mb-4">
                  <div className="flex items-center flex-grow">
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
                  {isEditing && (
                    <button
                      onClick={() => handleDeleteQuestionConfirm(q.originalIndex)}
                      className="ml-2 text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
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
                        className="mr-2 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
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
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Delete Test Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-xl font-bold text-red-600 mb-4">Confirm Delete Test</h3>
              <p className="text-neutral-700 mb-6">
                Are you sure you want to delete this test? This action cannot be undone and will remove all related student results.
              </p>
              <div className="flex justify-between gap-4">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteTest}
                  disabled={isDeleting}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1 disabled:bg-red-300"
                >
                  {isDeleting ? "Deleting..." : "Delete Test"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Question Confirmation Modal */}
        {showDeleteQuestionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-xl font-bold text-red-600 mb-4">Confirm Delete Question</h3>
              <p className="text-neutral-700 mb-6">
                Are you sure you want to delete question #{questionToDelete + 1}? This action cannot be undone.
              </p>
              <div className="flex justify-between gap-4">
                <button 
                  onClick={() => setShowDeleteQuestionModal(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteQuestion}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1"
                >
                  Delete Question
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer></Footer>
    </div>
  );
};

export default TestDetails;