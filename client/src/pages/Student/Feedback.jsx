import React, { useState, useEffect } from "react";
import axios from "axios";

const FeedBack = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]); // List of enrolled courses with instructors
  const [formData, setFormData] = useState({
    course: "",
    instructor: "",
    courseRating: 1,
    instructorRating: 1,
    comment: "",
    anonymousFeedback: false,
    feedbackType: "course",
  });

  // Fetch all feedback given by the user
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://sky-wings-server.vercel.app/course/feedback",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFeedbacks(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch feedbacks");
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Fetch enrolled courses with instructor details
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://sky-wings-server.vercel.app/course/enrolled",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEnrolledCourses(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch enrolled courses"
        );
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Automatically set the instructor when a course is selected
    if (name === "course" && value) {
      const selectedCourse = enrolledCourses.find(
        (enrollment) => enrollment.course._id === value
      );
      if (selectedCourse && selectedCourse.course.instructors?.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          instructor: selectedCourse.course.instructors[0]._id, // Set the first instructor by default
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          instructor: "", // Reset instructor if no instructors are available
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://sky-wings-server.vercel.app/course/feedback",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Add the new feedback to the list
      setFeedbacks([...feedbacks, response.data.feedback]);
      alert("Feedback submitted successfully!");
      setFormData({
        course: "",
        instructor: "",
        courseRating: 1,
        instructorRating: 1,
        comment: "",
        anonymousFeedback: false,
        feedbackType: "course",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Feedback</h2>

      {/* Submit Feedback Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-gray-50 p-5 rounded-lg shadow"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Submit Feedback
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course
            </label>
            <select
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a Course</option>
              {enrolledCourses.map((enrollment) => (
                <option
                  key={enrollment.course._id}
                  value={enrollment.course._id}
                >
                  {enrollment.course.title}
                </option>
              ))}
            </select>
          </div>

          {formData.course && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instructor
              </label>
              <select
                name="instructor"
                value={formData.instructor || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select an Instructor</option>
                {enrolledCourses
                  .find(
                    (enrollment) => enrollment.course._id === formData.course
                  )
                  ?.course.instructors?.map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Course Rating (1-5)
              </label>
              <input
                type="number"
                name="courseRating"
                value={formData.courseRating}
                onChange={handleInputChange}
                min="1"
                max="5"
                className="mt-1 block w-full p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instructor Rating (1-5)
              </label>
              <input
                type="number"
                name="instructorRating"
                value={formData.instructorRating}
                onChange={handleInputChange}
                min="1"
                max="5"
                className="mt-1 block w-full p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Comment
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Feedback Type
            </label>
            <select
              name="feedbackType"
              value={formData.feedbackType}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="course">Course</option>
              <option value="instructor">Instructor</option>
              <option value="platform">Platform</option>
            </select>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="anonymousFeedback"
                checked={formData.anonymousFeedback}
                onChange={handleInputChange}
                className="mr-2"
              />
              Submit Anonymously
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>

      {/* View Feedback */}
      <div className="bg-gray-50 p-5 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Feedback
        </h3>
        {feedbacks.length > 0 ? (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="border border-gray-200 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white"
              >
                <h4 className="text-lg font-semibold text-gray-800">
                  {feedback.course.title} - {feedback.feedbackType}
                </h4>
                <p className="text-gray-700 mt-2 text-sm">
                  <strong className="text-gray-900">Course Rating:</strong>{" "}
                  {feedback.courseRating}/5
                </p>
                <p className="text-gray-700 text-sm">
                  <strong className="text-gray-900">Instructor Rating:</strong>{" "}
                  {feedback.instructorRating}/5
                </p>
                <p className="text-gray-700 text-sm">
                  <strong className="text-gray-900">Comment:</strong>{" "}
                  {feedback.comment || "No comment"}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong className="text-gray-900">Anonymous:</strong>{" "}
                  {feedback.anonymousFeedback ? "Yes" : "No"}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong className="text-gray-900">Submitted on:</strong>{" "}
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            No feedback submitted yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default FeedBack;
