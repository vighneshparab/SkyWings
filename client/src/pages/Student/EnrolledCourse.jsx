import React, { useState, useEffect } from "react";
import axios from "axios";

const EnrolledCourse = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://sky-wings-server.vercel.app/api/course/enrolled",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEnrolledCourses(response.data);
        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch enrolled courses"
        );
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl w-full">
      {/* Enrolled Courses Section */}
      <section className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Enrolled Courses
        </h2>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((enrollment) => (
              <div
                key={enrollment._id}
                className="border p-4 rounded-lg hover:shadow-lg transition-shadow"
              >
                {enrollment.course.image && (
                 <img
                className="w-full h-48 object-cover md:w-64 md:h-full"
                src={
                  enrollment.course.image  ? course.image : "/uploads/default-course.jpg"
                }
                alt="Course Image"
              />
                )}
                <h3 className="text-lg font-semibold">
                  {enrollment.course.title}
                </h3>
                <p className="text-gray-600 mt-2">
                  {enrollment.course.description}
                </p>
                <div className="mt-4">
                  <a
                    href={`/course/${enrollment.course._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Course
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            You are not enrolled in any courses yet.
          </p>
        )}
      </section>
    </div>
  );
};

export default EnrolledCourse;
