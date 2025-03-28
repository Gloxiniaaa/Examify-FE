import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const StudentTakeTest = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const testInfo = state?.testInfo1; // Renamed to testInfo for consistency
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(testInfo?.duration || 3600);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BE_API_URL}/tests/${testInfo.id}/questions`, 
          {
            method: "GET",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            credentials: "include",
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        
        const data = await response.json();
        const validQuestions = data.data.filter(q => q.answers?.length > 0);
        setQuestions(validQuestions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (testInfo?.id) {
      fetchQuestions();
    }
  }, [testInfo]);

  useEffect(() => {
    if (timeRemaining <= 0 && !testSubmitted) {
      handleSubmitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, testSubmitted]);

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    // Xác nhận trước khi nộp bài nếu còn câu chưa trả lời
    const unansweredCount = questions.length - Object.keys(selectedAnswers).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `Bạn còn ${unansweredCount} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài?`
      );
      if (!confirmSubmit) return;
    }
  
    setIsSubmitting(true);
    
    try {
      // 1. Chuẩn bị dữ liệu gửi lên server
      const submissionTime = new Date().toISOString();
      const timeSpent = (testInfo?.duration || 3600) - timeRemaining;
      
      // 2. Gửi từng câu trả lời
      const submissionResults = await Promise.allSettled(
        Object.entries(selectedAnswers).map(([questionId, answerId]) => 
          submitAnswer({
            studentId,
            questionId: parseInt(questionId),
            answerId: parseInt(answerId),
            timeSpent,
            submittedAt: submissionTime
          })
        )
      );
  
      // 3. Xử lý kết quả gửi bài
      const failedSubmissions = submissionResults.filter(r => r.status === 'rejected');
      
      if (failedSubmissions.length > 0) {
        // Lưu các câu trả lời chưa gửi thành công
        saveFailedSubmissions(failedSubmissions);
        throw new Error(`Gửi thành công ${submissionResults.length - failedSubmissions.length}/${submissionResults.length} câu trả lời`);
      }
  
      // 4. Nếu tất cả thành công
      await completeTestSubmission({
        testId: testInfo?.id,
        studentId,
        timeSpent,
        submittedAt: submissionTime
      });
    
    } catch (error) {
      console.error('Lỗi khi nộp bài:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function để gửi từng câu trả lời
  const submitAnswer = async ({ studentId, questionId, answerId }) => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_BE_API_URL}/students/${studentId}/questions/${questionId}/answers/${answerId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      }
    );
  
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Lỗi khi gửi câu ${questionId}`);
    }
  
    return response.json();
  };
  
  // Helper function để hoàn tất quá trình nộp bài
  const completeTestSubmission = async ({ testId, studentId, timeSpent, submittedAt }) => {
    // Có thể thêm logic gửi thông tin tổng hợp ở đây
    // nếu backend có endpoint riêng cho việc này
    setTestSubmitted(true);
  };
  
  // Helper function lưu các câu trả lời thất bại
  const saveFailedSubmissions = (failedSubmissions) => {
    const failedAnswers = failedSubmissions.map(f => ({
      questionId: f.reason.questionId,
      answerId: f.reason.answerId,
      error: f.reason.message
    }));
  
    localStorage.setItem('failedAnswers', JSON.stringify({
      testId: testInfo?.id,
      answers: failedAnswers,
      timestamp: new Date().toISOString()
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <NavBar isAuthenticated={true} userRole="student" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-neutral-600">Đang tải câu hỏi...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <NavBar isAuthenticated={true} userRole="student" />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Đã xảy ra lỗi</h2>
            <p className="text-neutral-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Thử lại
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (testSubmitted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <NavBar isAuthenticated={true} userRole="student" />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Nộp bài thành công!</h2>
            <p className="text-neutral-600 mb-6">Kết quả sẽ được thông báo sau khi chấm bài.</p>
            <button 
              onClick={() => navigate('/student')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Về trang chủ
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <NavBar isAuthenticated={true} userRole="student" />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Không có câu hỏi</h2>
            <p className="text-neutral-600 mb-6">Bài kiểm tra này hiện chưa có câu hỏi.</p>
            <button 
              onClick={() => navigate('/student/dashboard')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Về trang chủ
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <NavBar />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-800">
              {testInfo?.name || "Bài kiểm tra"}
            </h2>
            <div className="bg-red-100 text-red-700 px-3 py-1 rounded">
              Thời gian: {formatTime(timeRemaining)}
            </div>
          </div>

          <h3 className="font-medium text-neutral-800 mb-3">Danh sách câu hỏi</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded flex items-center justify-center ${
                  currentQuestionIndex === index
                    ? 'bg-blue-500 text-white'
                    : selectedAnswers[q.id]
                      ? 'bg-green-100 text-green-700'
                      : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="mb-6">
            <div className="flex justify-between mb-4 mt-5">
              <span className="text-sm text-neutral-500">
                Câu {currentQuestionIndex + 1}/{questions.length}
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-neutral-800 mb-4">
              {currentQuestion.content}
            </h3>

            <div className="space-y-3">
              {currentQuestion.answers.map(answer => (
                <div 
                  key={answer.id}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    selectedAnswers[currentQuestion.id] === answer.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-neutral-300 hover:bg-neutral-50'
                  }`}
                  onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                >
                  {answer.content}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded ${
                currentQuestionIndex === 0 
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' 
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              Câu trước
            </button>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Tiếp theo
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
              </button>
            )}
          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
};

export default StudentTakeTest;