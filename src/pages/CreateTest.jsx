// CreateTest.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";

const CreateTest = () => {
  const navigate = useNavigate();
  const [testDetails, setTestDetails] = useState({
    title: "",
    description: "",
    testTime: "", // in minutes
    startTime: "",
    closeTime: "",
  });

  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });

  const handleTestDetailsChange = (e) => {
    const { name, value } = e.target;
    setTestDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionTextChange = (e) => {
    setNewQuestion((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index][field] = value;
    setNewQuestion((prev) => ({ ...prev, options: updatedOptions }));
  };

  const addOption = () => {
    if (newQuestion.options.length < 5) {
      // Limit to 5 options for simplicity
      setNewQuestion((prev) => ({
        ...prev,
        options: [...prev.options, { text: "", isCorrect: false }],
      }));
    }
  };

  const removeOption = (index) => {
    if (newQuestion.options.length > 1) {
      // Minimum 2 options
      const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
      setNewQuestion((prev) => ({ ...prev, options: updatedOptions }));
    }
  };

  const addQuestion = () => {
    if (!newQuestion.text || newQuestion.options.some((opt) => !opt.text)) {
      alert("Please fill in the question and all options");
      return;
    }
    if (!newQuestion.options.some((opt) => opt.isCorrect)) {
      alert("Please mark at least one option as correct");
      return;
    }
    setQuestions([...questions, newQuestion]);
    setNewQuestion({
      text: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !testDetails.title ||
      !testDetails.testTime ||
      !testDetails.startTime ||
      !testDetails.closeTime
    ) {
      alert("Please fill in all test details");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }
    const testData = { ...testDetails, questions };
    console.log("Test Created:", testData);
    // In a real app, send testData to your API
    navigate("/teacher/dashboard");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar></Navbar>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-neutral-800 mb-6">
          Create New Test
        </h2>

        {/* Test Details Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-12"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-neutral-600 mb-2 font-medium"
              >
                Test Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={testDetails.title}
                onChange={handleTestDetailsChange}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter test title"
                required
              />
            </div>
            <div>
              <label
                htmlFor="testTime"
                className="block text-neutral-600 mb-2 font-medium"
              >
                Test Duration (minutes)
              </label>
              <input
                type="number"
                id="testTime"
                name="testTime"
                value={testDetails.testTime}
                onChange={handleTestDetailsChange}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 60"
                min="1"
                required
              />
            </div>
            <div>
              <label
                htmlFor="startTime"
                className="block text-neutral-600 mb-2 font-medium"
              >
                Start Time
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={testDetails.startTime}
                onChange={handleTestDetailsChange}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label
                htmlFor="closeTime"
                className="block text-neutral-600 mb-2 font-medium"
              >
                Close Time
              </label>
              <input
                type="datetime-local"
                id="closeTime"
                name="closeTime"
                value={testDetails.closeTime}
                onChange={handleTestDetailsChange}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-neutral-600 mb-2 font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={testDetails.description}
              onChange={handleTestDetailsChange}
              className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter test description"
              rows="4"
            />
          </div>
        </form>

        {/* Questions Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
            Add Questions
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label
                htmlFor="questionText"
                className="block text-neutral-600 mb-2 font-medium"
              >
                Question
              </label>
              <input
                type="text"
                id="questionText"
                value={newQuestion.text}
                onChange={handleQuestionTextChange}
                className="w-full px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your question"
              />
            </div>
            <div className="mb-6">
              <label className="block text-neutral-600 mb-2 font-medium">
                Options
              </label>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(index, "text", e.target.value)
                    }
                    className="flex-grow px-3 py-2 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Option ${index + 1}`}
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={(e) =>
                        handleOptionChange(index, "isCorrect", e.target.checked)
                      }
                      className="mr-2"
                    />
                    Correct
                  </label>
                  {newQuestion.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {newQuestion.options.length < 5 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="text-primary hover:underline mt-2"
                >
                  Add Option
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition"
            >
              Add Question
            </button>
          </div>
          {/* Display Added Questions with Remove Option */}
          {questions.length > 0 && (
            <div className="mt-6">
              <h4 className="text-xl font-semibold text-neutral-800 mb-4">
                Added Questions
              </h4>
              {questions.map((q, index) => (
                <div
                  key={index}
                  className="bg-accent p-4 rounded-md mb-4 flex justify-between items-start"
                >
                  <div>
                    <p className="text-neutral-800 font-medium">
                      {index + 1}. {q.text}
                    </p>
                    <ul className="list-disc pl-6 mt-2">
                      {q.options.map((opt, i) => (
                        <li
                          key={i}
                          className={
                            opt.isCorrect
                              ? "text-green-600"
                              : "text-neutral-600"
                          }
                        >
                          {opt.text} {opt.isCorrect && "(Correct)"}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <button
          type="submit"
          form="testForm"
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-secondary transition"
        >
          Save Test
        </button>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default CreateTest;
