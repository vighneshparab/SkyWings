import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
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

  // Get unique categories for filter
  const categories = courses.length > 0 
    ? ["all", ...new Set(courses.map(course => course.category))] 
    : ["all"];

  const filteredCourses = filter === "all" 
    ? courses 
    : courses.filter(course => course.category === filter);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-blue-50 to-gray-50">
        {/* Hero Section */}
        <div className="w-full bg-blue-600 py-12 sm:py-16 md:py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Expand Your Horizons
            </h1>
            <p className="text-blue-100 text-lg sm:text-xl max-w-3xl mx-auto mb-8">
              Discover our professional aviation courses designed to elevate your career to new heights
            </p>
            <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full"></div>
          </div>
        </div>

        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Section Title */}
            <div className="mb-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Explore Our Courses
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                From beginner to advanced, find the perfect aviation course to match your ambitions and take your career to new heights.
              </p>
            </div>

            {/* Category Filter */}
            {!loading && !error && (
              <div className="mb-8 overflow-x-auto">
                <div className="flex space-x-2 min-w-max pb-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setFilter(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filter === category
                          ? "bg-blue-600 text-white shadow-md" 
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-5">
                      <div className="h-6 bg-gray-300 rounded mb-3"></div>
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="space-y-2 mt-4">
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </div>
                      <div className="h-10 bg-gray-300 rounded-lg mt-6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-500 text-5xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-600 text-xl mb-2 font-medium">{error}</p>
                <p className="text-gray-600">Please check your connection and try again</p>
              </div>
            ) : (
              <>
                {filteredCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No courses found in this category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredCourses.map((course) => (
                      <div
                        key={course._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] flex flex-col"
                      >
                        {/* Course Image with Overlay */}
                        <div className="relative overflow-hidden">
                          <img
                            className="w-full h-48 sm:h-52 object-cover transition-all duration-500 hover:scale-105"
                            src={
                              course.image
                                ? course.image
                                : "/uploads/default-course.jpg"
                            }
                            alt={`${course.title} course`}
                          />
                          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                            {course.courseLevel}
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                          {/* Category Badge */}
                          <div className="mb-2">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {course.category}
                            </span>
                          </div>

                          {/* Course Title */}
                          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                            {course.title}
                          </h3>

                          {/* Course Description */}
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {course.description}
                          </p>

                          {/* Course Details */}
                          <div className="text-gray-500 text-xs space-y-2 mb-4 flex-grow">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span><strong>Duration:</strong> {course.courseDuration}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span><strong>Starts:</strong> {new Date(course.schedule).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span><strong>Instructor:</strong> {course.instructors.map((inst) => inst.name).join(", ")}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span><strong>Fees:</strong> ₹{course.fees.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <button
                            onClick={() => navigate(`/course/${course._id}`)}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium text-sm hover:from-blue-600 hover:to-blue-700 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          >
                            Explore Course
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            
            {/* Call to action */}
            {!loading && !error && (
              <div className="mt-16 text-center">
                <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
                <button
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition"
                >
                  Request Custom Training
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Courses;
