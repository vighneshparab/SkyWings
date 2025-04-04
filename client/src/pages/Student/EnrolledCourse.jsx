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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold text-gray-700 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 font-semibold text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Enrolled Courses Section */}
      <section className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Your Enrolled Courses
        </h2>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {enrolledCourses.map((enrollment) => (
              <div
                key={enrollment._id}
                className="bg-white border p-4 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105"
              >
                {/* Course Image */}
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover rounded-lg"
                    src={
                      enrollment.course.image?.startsWith("http")
                        ? enrollment.course.image
                        : `https://sky-wings-server.vercel.app/uploads/${enrollment.course.image}`
                    }
                    alt={enrollment.course.title}
                  />
                  <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-3 py-1 rounded-md">
                    Enrolled
                  </div>
                </div>

                {/* Course Details */}
                <h3 className="text-xl font-semibold mt-4 truncate">
                  {enrollment.course.title}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {enrollment.course.description}
                </p>

                {/* CTA Button */}
                <div className="mt-4">
                  <a
                    href={`/course/${enrollment.course._id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                  >
                    View Course
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            You are not enrolled in any courses yet.
          </p>
        )}
      </section>
    </div>
  );
};

export default EnrolledCourse;
