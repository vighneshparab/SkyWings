import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://sky-wings-server.vercel.app/api/course")
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load courses. Please try again.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-10 text-center">
            Explore Our Courses
          </h2>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-lg shadow-lg animate-pulse"
                >
                  <div className="h-40 bg-gray-300 rounded mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-10 bg-gray-300 rounded mt-4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-red-600 text-center text-lg">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                >
                  <img
                    src="/uploads/1742379706696-pexels-starstra-30382519.jpg"
                    alt="Uploaded Image"
                  />

                  {/* Course Title */}
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {course.title}
                  </h3>

                  {/* Course Description */}
                  <p className="text-gray-600 text-sm mb-3">
                    {course.description.length > 100
                      ? `${course.description.substring(0, 100)}...`
                      : course.description}
                  </p>

                  {/* Course Details */}
                  <div className="text-gray-500 text-sm space-y-1 mb-3">
                    <p>
                      <strong>Category:</strong> {course.category}
                    </p>
                    <p>
                      <strong>Level:</strong> {course.courseLevel} |{" "}
                      <strong>Duration:</strong> {course.courseDuration}
                    </p>
                    <p>
                      <strong>Type:</strong> {course.courseType} |{" "}
                      <strong>Fees:</strong> ₹{course.fees}
                    </p>
                    <p>
                      <strong>Schedule:</strong>{" "}
                      {new Date(course.schedule).toDateString()}
                    </p>
                    <p>
                      <strong>Instructor:</strong>{" "}
                      {course.instructors.map((inst) => inst.name).join(", ")}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold text-lg hover:bg-blue-600 transition duration-300"
                  >
                    Explore Course
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Courses;
