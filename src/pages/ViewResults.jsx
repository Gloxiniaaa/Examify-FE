import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const ViewResults = () => {
  const { testId , title} = useParams();
  const [results] = useState([
    {
      id: 1,
      name: "Nguyen Van A",
      TotalScore: "80/100",
      StartTime: "2025-03-20 21:00",
      EndTime:  "2025-03-20 21:20",
      times: 3,
    },
    {
      id: 2,
      name: "Nguyen Van BB",
      TotalScore: "95/100",
      StartTime: "2025-03-20 21:10",
      EndTime:  "2025-03-20 21:20",
      times: 2,
    },
    {
      id: 3,
      name: "Nguyen Van BB",
      TotalScore: "95/100",
      StartTime: "2025-03-20 21:10",
      EndTime:  "2025-03-20 21:20",
      times: 2,
    },
    {
      id: 4,
      name: "Nguyen Van BB",
      TotalScore: "95/100",
      StartTime: "2025-03-20 21:10",
      EndTime:  "2025-03-20 21:20",
      times: 2,
    },
    {
      id: 5,
      name: "Nguyen Van BB",
      TotalScore: "95/100",
      StartTime: "2025-03-20 21:10",
      EndTime:  "2025-03-20 21:20",
      times: 2,
    },
  ]);
  // useEffect(() => {
  //   const [results, setResults] = useState([]);
  //   const fetchResults = async () => {
  //     try {
  //       const response = await fetch(`https://your-api.com/results?testId=${testId}`);
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const data = await response.json();
  //       setResults(data); 
  //     } catch (error) {
  //       console.error("Error fetching results:", error);
  //     } 
  //   };

  //   fetchResults(); 
  // }, [testId]); 

  // const handleLogout = () => {
  //   // Add your logout logic here
  //   console.log("Logging out...");
  // };

 



  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/teacher" className="text-2xl font-bold text-primary">Examify</Link>
          <button className="text-neutral-600 hover:text-primary">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}


        {/* Existing Tests */}
        <section>
          <h3 className="text-2xl font-semibold text-neutral-800 mb-6">
            Result of {title}
          </h3>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-accent">
                <tr>
                  <th className="text-left p-4 text-neutral-800">Student ID </th>
                  <th className="text-left p-4 text-neutral-800">Student Name</th>
                  <th className="text-left p-4 text-neutral-800">Score</th>
                  <th className="text-left p-4 text-neutral-800">StartTime</th>
                  <th className="text-left p-4 text-neutral-800">EndTime</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr
                    key={result.id}
                    className="border-t border-neutral-600 hover:bg-accent"
                  >
                    <td className="p-4 text-neutral-600">{result.id}</td>
                    <td className="p-4 text-neutral-600">{result.name}</td>
                    <td className="p-4 text-neutral-600">{result.TotalScore}</td>
                    <td className="p-4 text-neutral-600">{result.StartTime}</td>
                    <td className="p-4 text-neutral-600">{result.EndTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default ViewResults;
