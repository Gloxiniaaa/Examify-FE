import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ResultPage = () => {
  const { state } = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const testId = state?.testId;

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const studentId = parseInt(localStorage.getItem("userId"), 10);
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BE_API_URL}/tests/${testId}/students/${studentId}/results`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok && data.status === "OK") {
          setResult(data.data);
        } else {
          setError(data.message || "Không thể lấy kết quả.");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi lấy kết quả: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [testId]);

  if (loading) {
    return <p className="text-center text-lg">Đang tải kết quả...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-neutral-800 mb-6 text-center">
        Kết quả bài kiểm tra: {result?.title}
      </h2>
      {result && (
        <>
          <div className="mb-6 text-center">
            <p className="text-xl font-semibold">
              Điểm số: <span className="text-blue-600">{result.result.totalscore}</span> / 10
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {result.questions.map((question, index) => {
              // Tìm câu trả lời của sinh viên dựa trên answerid
              const userAnswer = question.answers.find((ans) => ans.id === question.answerid)?.content || "Chưa trả lời";
              // Tìm câu trả lời đúng dựa trên iscorrect
              const correctAnswer = question.answers.find((ans) => ans.iscorrect)?.content || "Không có";

              return (
                <div key={question.id} className="mb-6 border-b pb-4">
                  <p className="text-lg font-medium text-gray-800">
                    Câu {index + 1}: {question.content}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Câu trả lời của bạn: <span className="font-medium">{userAnswer}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Câu trả lời đúng: <span className="font-medium">{correctAnswer}</span>
                  </p>
                  <p
                    className={`text-sm font-semibold mt-1 ${
                      question.iscorrect ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {question.iscorrect ? "Đúng" : "Sai"}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ResultPage;