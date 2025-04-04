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
    return <div className="text-center mt-8 text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500 text-lg">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Enrolled Courses Section */}
      <section className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          My Enrolled Courses
        </h2>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((enrollment) => (
              <div
                key={enrollment._id}
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* Course Image */}
                <img
                  className="w-full h-52 object-cover"
                  src={
                    enrollment.course?.image
                      ? enrollment.course.image
                      : "/uploads/default-course.jpg"
                  }
                  alt={enrollment.course?.title || "Course Image"}
                />

                {/* Course Details */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {enrollment.course?.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {enrollment.course?.description}
                  </p>

                  {/* View Course Button */}
                  <div className="mt-4">
                    <a
                      href={`/course/${enrollment.course?._id}`}
                      className="inline-block px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 transition-all rounded-md text-center w-full"
                    >
                      View Course
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            You are not enrolled in any courses yet.
          </p>
        )}
      </section>
    </div>
  );
};

export default EnrolledCourse;
