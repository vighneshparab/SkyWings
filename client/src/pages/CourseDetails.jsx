import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import EnrollButton from "../components/EnrollButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://sky-wings-server.vercel.app/api/course/${id}`)
      .then((response) => {
        setCourse(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load course details. Please try again.");
        setLoading(false);
      });

    axios
      .get("https://sky-wings-server.vercel.app/api/course")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((err) => {
        console.error("Failed to load courses:", err);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-gray-600">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  const relatedCourses = courses.filter((c) => c._id !== id).slice(0, 3);

  return (
    <>
      <Navbar />
      <section className="py-16 px-4 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:shrink-0">
              <img
                className="h-48 w-full object-cover md:h-full md:w-64"
                src="/uploads/1742379706696-pexels-starstra-30382519.jpg"
                alt="Course Image"
              />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                {course.category}
              </div>
              <h2 className="mt-1 block text-lg leading-tight font-medium text-black hover:underline">
                {course.title}
              </h2>
              <p className="mt-2 text-gray-500">{course.description}</p>

              <div className="mt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">Level</p>
                    <p className="text-sm text-gray-600">
                      {course.courseLevel}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">
                      Duration
                    </p>
                    <p className="text-sm text-gray-600">
                      {course.courseDuration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">Type</p>
                    <p className="text-sm text-gray-600">{course.courseType}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">Fees</p>
                    <p className="text-sm text-gray-600">₹{course.fees}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">
                      Schedule
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(course.schedule).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Instructors
                  </p>
                  <p className="text-sm text-gray-600">
                    {course.instructors.map((inst) => inst.name).join(", ")}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <EnrollButton courseId={course._id} />
                <button
                  onClick={() => navigate(-1)}
                  className="ml-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>

          {/* Course Curriculum Section */}
          <div className="p-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Course Curriculum</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Introduction to the Course</li>
              <li>Module 1: Foundations</li>
              <li>Module 2: Advanced Concepts</li>
              <li>Project Work and Assignments</li>
              <li>Final Assessment</li>
            </ul>
          </div>

          {/* Instructor Bio Section */}
          <div className="p-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4">
              About the Instructors
            </h3>
            {course.instructors.map((instructor) => (
              <div key={instructor._id} className="mb-4">
                <h4 className="font-semibold">{instructor.name}</h4>
                <p className="text-gray-600">{instructor.bio}</p>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="p-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">
                  What are the prerequisites for this course?
                </h4>
                <p className="text-gray-600">
                  Basic knowledge of the subject is recommended.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">
                  Is there any certification provided?
                </h4>
                <p className="text-gray-600">
                  Yes, a certificate of completion will be provided.
                </p>
              </div>
            </div>
          </div>

          {/* Related Courses Section */}
          <div className="p-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Related Courses</h3>
            <div className="flex space-x-4 overflow-x-auto">
              {relatedCourses.map((relatedCourse) => (
                <div
                  key={relatedCourse._id}
                  className="bg-gray-50 p-4 rounded-md w-64 shrink-0"
                >
                  <h5 className="font-semibold">{relatedCourse.title}</h5>
                  <p className="text-sm text-gray-600">
                    {relatedCourse.description.substring(0, 50)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CourseDetails;
