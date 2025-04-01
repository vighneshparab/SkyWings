import React, { useState, useEffect } from "react";
import axios from "axios";

function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sessions, setSessions] = useState({});

  // Fetch instructor's courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from local storage

        if (!token) {
          setError("Authentication token not found.");
          setLoading(false);
          return; // Exit if no token
        }

        const response = await axios.get(
          "http://localhost:5000/api/instructor/courses",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in Authorization header
            },
          }
        );
        setCourses(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Unauthorized access. Please log in again.");
          // Optionally, clear local storage and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login"); // Assuming you have 'navigate' from react-router-dom
        } else {
          setError("Failed to load courses.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch sessions for a selected course
  const fetchSessions = async (courseId) => {
    try {
      if (sessions[courseId]) return; // Prevent redundant API calls

      const token = localStorage.getItem("token"); // Retrieve token from local storage

      if (!token) {
        setError("Authentication token not found.");
        return; // Exit if no token
      }

      const response = await axios.get(
        `http://localhost:5000/api/instructor/courses/${courseId}/sessions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSessions((prev) => ({ ...prev, [courseId]: response.data }));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Unauthorized access. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        setError("Failed to load sessions.");
      }
    }
  };

  // Handle clicking on a course
  const handleCourseClick = (courseId) => {
    setSelectedCourse(selectedCourse === courseId ? null : courseId); // Toggle selection
    if (!sessions[courseId]) fetchSessions(courseId);
  };

  if (loading) return <p className="text-gray-600">Loading courses...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
      {courses.length === 0 ? (
        <p className="text-gray-600">No courses found.</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course._id}>
              <div
                className={`p-4 rounded-lg cursor-pointer transition ${
                  selectedCourse === course._id
                    ? "bg-blue-50 border-l-4 border-blue-600"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => handleCourseClick(course._id)}
              >
                <h3 className="text-lg font-medium text-gray-800">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {course.enrolledStudents.length} students enrolled
                </p>
                <p className="text-xs text-gray-500">{course.description}</p>
                <p className="text-xs text-gray-500">
                  Duration: {course.duration} hrs
                </p>
              </div>

              {/* Show Sessions when course is selected */}
              {selectedCourse === course._id && sessions[course._id] && (
                <div className="ml-4 mt-2 p-3 bg-gray-100 rounded">
                  <h4 className="text-md font-semibold">Sessions</h4>
                  {sessions[course._id].length > 0 ? (
                    <ul className="list-disc pl-4">
                      {sessions[course._id].map((session) => (
                        <li key={session._id} className="text-sm text-gray-700">
                          {session.title} - {session.date}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No sessions available.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InstructorCourses;
