import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const TestFinal = () => {
  const { state } = useLocation();
  const testId = state?.testId;
  const passcode = state?.passcode;
  const startTime = state?.startTime;
  const endTimeISO = state?.endTimeISO;
  const numberOfQuestion = state?.numberOfQuestion;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [writtenAnswers, setWrittenAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Lấy danh sách câu hỏi khi component mount
  useEffect(() => {
    const fetchQuestionsAndInitialize = async () => {
      try {
        if (!testId) throw new Error("Không tìm thấy testId.");
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BE_API_URL}/tests/${testId}/questions`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const result = await response.json();
        if (response.ok && result.status === "OK") {
          setQuestions(result.data);
  
          // Khởi tạo bản ghi câu trả lời cho từng câu hỏi
          const studentId = parseInt(localStorage.getItem("userId"), 10);
          for (const question of result.data) {
            const initResponse = await fetch(
              `${import.meta.env.VITE_REACT_APP_BE_API_URL}/students/${studentId}/answers?questionId=${question.id}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              }
            );
            if (!initResponse.ok) {
              console.error(`Không thể khởi tạo câu trả lời cho câu hỏi ${question.id}`);
            }
          }
        } else {
          setError(result.message || "Không thể lấy câu hỏi.");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi lấy câu hỏi hoặc khởi tạo: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionsAndInitialize();
  }, [testId]);

  // Time calculation effect
  useEffect(() => {
    if (!startTime || !endTimeISO) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const endTime = new Date(endTimeISO);
      const diff = endTime - now;

      if (diff <= 0) {
        handleSubmit();
        return 0;
      }
      return Math.floor(diff / 1000);
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        clearInterval(timer);
        handleSubmit(); // Tự động nộp bài khi hết giờ
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTimeISO, navigate]); // Thêm navigate vào dependencies

  // Gửi câu trả lời tự luận sau khi ngừng nhập (debounce 2 giây)
  useEffect(() => {
    const timer = setTimeout(async () => {
      const studentId = parseInt(localStorage.getItem("userId"), 10);
      for (const [questionId, answer] of Object.entries(writtenAnswers)) {
        if (answer) {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_REACT_APP_BE_API_URL}/students/${studentId}/answers`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ questionId, answer }),
              }
            );
            if (!response.ok) {
              throw new Error(`Không thể gửi câu trả lời tự luận cho câu hỏi ${questionId}.`);
            }
          } catch (error) {
            console.error("Lỗi khi gửi câu trả lời tự luận:", error);
            setError("Đã xảy ra lỗi khi gửi câu trả lời tự luận.");
          }
        }
      }
    }, 2000); // Chờ 2 giây sau khi ngừng nhập

    return () => clearTimeout(timer);
  }, [writtenAnswers]);

  // Định dạng thời gian
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Xử lý chọn đáp án trắc nghiệm và gửi ngay đến server
  const handleAnswerSelect = async (questionId, answerId) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  
    const studentId = parseInt(localStorage.getItem("userId"), 10);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BE_API_URL}/students/${studentId}/questions/${questionId}/answers/${answerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`Không thể cập nhật câu trả lời cho câu hỏi ${questionId}.`);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật câu trả lời:", error);
      setError("Đã xảy ra lỗi khi gửi câu trả lời.");
    }
  };

  // Xử lý nhập câu trả lời tự luận
  const handleWrittenAnswer = (questionId, answer) => {
    setWrittenAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // Xử lý nộp bài (chỉ cập nhật endTime và điều hướng)
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const studentId = parseInt(localStorage.getItem("userId"), 10);
    const endTime = new Date().toISOString();

    try {
      const resultDTO = { studentId, testId, endTime };
      const resultResponse = await fetch(
        `${import.meta.env.VITE_REACT_APP_BE_API_URL}/students/${studentId}/results`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(resultDTO),
        }
      );
      if (!resultResponse.ok) {
        throw new Error("Không thể cập nhật thời gian kết thúc bài kiểm tra.");
      }

      console.log("Navigating to results with testId:", testId);
      navigate(`/student/results/${testId}`, { state: { testId } });
    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
      setError(`Đã xảy ra lỗi khi nộp bài: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-neutral-50">
      <NavBar/>
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-neutral-800 mb-6">
        Bài kiểm tra (Passcode: {passcode})
      </h2>
      <p className="text-lg mb-4">
        Thời gian còn lại: {timeLeft !== null ? formatTime(timeLeft) : "Đang tính..."}
      </p>
      {questions.map((question) => (
        <div key={question.id} className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <p className="text-lg font-medium">{question.content}</p>
          <p className="text-sm text-gray-500">Điểm: {question.score}</p>
          {question.answers.length > 0 ? (
            question.answers.map((answer) => (
              <label key={answer.id} className="block mt-2">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={answer.id}
                  onChange={() => handleAnswerSelect(question.id, answer.id)}
                  className="mr-2"
                />
                {answer.content}
              </label>
            ))
          ) : (
            <textarea
              className="w-full px-3 py-2 mt-2 border border-neutral-600 rounded-md"
              placeholder="Nhập câu trả lời của bạn"
              onChange={(e) => handleWrittenAnswer(question.id, e.target.value)}
            />
          )}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
      >
        {isSubmitting ? "Đang nộp..." : "Nộp bài"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>  
    </div>
  );
};

export default TestFinal;