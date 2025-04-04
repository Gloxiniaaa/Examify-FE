import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const StudentTest = () => {
  const { state } = useLocation(); // Lấy thông tin bài kiểm tra từ StudentDashboard
  const navigate = useNavigate();
  const testInfo = state?.testInfo;
  //const testTime = state?.a;
  const handleStartTest = async () => {
    console.log("testInfo", testInfo);
    if (testInfo) {
      const studentId = parseInt(localStorage.getItem("userId"), 10);
      const startTimea = new Date();
  
      // Kiểm tra xem startTimea có hợp lệ không
      if (isNaN(startTimea.getTime())) {
        console.error("startTimea is invalid");
        return;
      }
  
      // Sử dụng testInfo.testtime thay vì state.a
      const testTime = testInfo.testtime;
      if (typeof testTime !== "number" || isNaN(testTime)) {
        console.error("testTime is not a valid number:", testTime);
        return;
      }
  
      const endTime = new Date(startTimea.getTime() + testTime * 60000);
      if (isNaN(endTime.getTime())) {
        console.error("endTime is invalid");
        return;
      }
  
      const startTime = startTimea.toISOString();
      const endTimeISO = endTime.toISOString();
  
      if (!testInfo.id) {
        console.error("testId is missing in testInfo");
        return;
      }
  
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BE_API_URL}/students/${studentId}/results`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify({ studentId, testId: testInfo.id, startTime }),
          }
        );
  
        if (!response.ok) {
          throw new Error("Không thể bắt đầu bài kiểm tra.");
        }
        console.log("Bài kiểm tra đã bắt đầu thành công.");
        navigate(`/student/test/${testInfo.id}/taketest`, {
          state: {
            passcode: testInfo.passcode,
            testId: testInfo.id,
            startTime,
            endTimeISO,
            numberOfQuestion: testInfo.numberOfQuestion,
          },
        });
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu bắt đầu bài kiểm tra:", error);
      }
    }
  };
        
  // Nếu không có thông tin bài kiểm tra, hiển thị lỗi
  if (!testInfo) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-red-500">No test information available. Please enter a valid passcode.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <NavBar isAuthenticated={true} userRole="student" onLogout={() => console.log("Logging out...")} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">Test Information</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-neutral-600 mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={testInfo.title}
                  disabled
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-2 font-medium">Duration (minutes)</label>
                <input
                  type="number"
                  value={testInfo.testtime}
                  disabled
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-2 font-medium">Time Open</label>
                <input
                  type="text"
                  value={new Date(testInfo.timeopen).toLocaleString()}
                  disabled
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-2 font-medium">Time Close</label>
                <input
                  type="text"
                  value={new Date(testInfo.timeclose).toLocaleString()}
                  disabled
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-2 font-medium">Passcode</label>
                <input
                  type="text"
                  value={testInfo.passcode}
                  disabled
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-2 font-medium">Number of Questions</label>
                <input
                  type="number"
                  value={testInfo.numberquestion}
                  disabled
                  className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-neutral-600 mb-2 font-medium">Description</label>
              <textarea
                value={testInfo.description}
                disabled
                className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-100 text-neutral-600"
                rows="4"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleStartTest}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
              >
                Take Test
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StudentTest;