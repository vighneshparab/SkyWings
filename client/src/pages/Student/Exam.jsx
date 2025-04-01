import React, { useEffect, useState } from "react";
import axios from "axios";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/student/exams",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setExams(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch exams");
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) return <div className="text-center py-8">Loading exams...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">My Exams</h2>

      {exams.length === 0 ? (
        <p className="text-gray-500">No exams found.</p>
      ) : (
        <div className="space-y-4">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-blue-700">
                    {exam.course?.name} -{" "}
                    {exam.examType.charAt(0).toUpperCase() +
                      exam.examType.slice(1)}
                  </h3>
                  <div className="flex gap-4 mt-1">
                    <span className="text-sm text-gray-500">
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(exam.examDate).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      <span className="font-medium">Passing:</span>{" "}
                      {exam.passingPercentage}%
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {exam.score !== undefined ? (
                    <>
                      <span className="text-lg font-bold">
                        {exam.score}/{exam.totalMarks}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          exam.status === "pass"
                            ? "bg-green-100 text-green-800"
                            : exam.status === "fail"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {exam.status.toUpperCase()}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      Pending evaluation
                    </span>
                  )}
                </div>
              </div>
              {exam.googleFormLink && (
                <a
                  href={exam.googleFormLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-blue-600 hover:underline"
                >
                  View Exam Submission
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Exams;
