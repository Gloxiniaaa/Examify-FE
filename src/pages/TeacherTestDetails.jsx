// TestDetails.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTestDetails,
  updateTest,
  selectTeacherTests,
} from "../store/teacherTestSlice";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

const TestDetails = () => {
  const { testId } = useParams();
  const dispatch = useDispatch();
  const { currentTest, loading, error } = useSelector(selectTeacherTests);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTest, setEditedTest] = useState(null);

  useEffect(() => {
    dispatch(fetchTestDetails(testId));
  }, [dispatch, testId]);

  useEffect(() => {
    if (currentTest) {
      setEditedTest({ ...currentTest }); // Initialize editable copy
    }
  }, [currentTest]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name !== "passcode") {
      // Prevent editing passcode
      setEditedTest((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...editedTest.questions];
    updatedQuestions[index][field] = value;
    setEditedTest((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updatedQuestions = [...editedTest.questions];
    updatedQuestions[qIndex].answers[oIndex][field] = value;
    setEditedTest((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateTest({ testId, testData: editedTest })).unwrap();
      setIsEditing(false);
    } catch (err) {
      alert("Failed to save changes: " + err);
    }
  };

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
              <label className="block text-neutral-600 mb-2 font-medium">
                Title
              </label>
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
              <label className="block text-neutral-600 mb-2 font-medium">
                Duration (minutes)
              </label>
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
              <label className="block text-neutral-600 mb-2 font-medium">
                Time Open
              </label>
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
              <label className="block text-neutral-600 mb-2 font-medium">
                Time Close
              </label>
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
              <label className="block text-neutral-600 mb-2 font-medium">
                Passcode
              </label>
              <input
                type="text"
                name="passcode"
                value={editedTest.passcode}
                disabled={true} // Always disabled
                className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-neutral-600 mb-2 font-medium">
              Description
            </label>
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

        {/* Questions */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
            Questions
          </h3>
          {editedTest.questions &&
            editedTest.questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-white p-6 rounded-lg shadow-md mb-4"
              >
                <input
                  type="text"
                  value={q.content}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "content", e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                />
                {q.answers.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-4 mb-2">
                    <input
                      type="text"
                      value={opt.content}
                      onChange={(e) =>
                        handleOptionChange(
                          qIndex,
                          oIndex,
                          "content",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      className="flex-grow px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={opt.isCorrect}
                        onChange={(e) =>
                          handleOptionChange(
                            qIndex,
                            oIndex,
                            "isCorrect",
                            e.target.checked
                          )
                        }
                        disabled={!isEditing}
                        className="mr-2"
                      />
                      Correct
                    </label>
                  </div>
                ))}
              </div>
            ))}
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
