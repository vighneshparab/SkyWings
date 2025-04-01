import React, { useState, useEffect } from "react";
import axios from "axios";

function InstructorExams() {
  // State management
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [instructorId, setInstructorId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    course: "",
    student: "",
    examType: "",
    googleFormLink: "",
    totalMarks: "",
    passingPercentage: "",
    examDate: new Date().toISOString().split("T")[0],
  });

  const [gradingData, setGradingData] = useState({
    score: "",
  });

  // API endpoints
  const apiUrl = "http://localhost:5000/api/instructor/courses/exams";
  const coursesUrl = "http://localhost:5000/api/instructor/courses";
  const studentsUrl = "http://localhost:5000/api/instructor/students";

  // Helper function to get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }
    return token;
  };

  // Fetch instructor ID from token
  const fetchInstructorId = () => {
    try {
      const token = getAuthToken();
      const payload = JSON.parse(atob(token.split(".")[1]));
      setInstructorId(payload.userId);
    } catch (error) {
      setError("Failed to fetch instructor ID");
    }
  };

  // Fetch all courses for the instructor
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(coursesUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching courses");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch students for selected course
  const fetchStudentsForCourse = async (courseId) => {
    if (!courseId) return;

    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(`${studentsUrl}/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching students");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch exams for selected course
  const fetchExamsForCourse = async (courseId) => {
    if (!courseId) {
      setExams([]);
      return;
    }

    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(`${apiUrl}?course=${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching exams");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle course selection
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setFormData({ ...formData, course: courseId, student: "" }); // Reset student when course changes

    if (courseId) {
      fetchStudentsForCourse(courseId);
      fetchExamsForCourse(courseId);
    } else {
      setStudents([]);
      setExams([]);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle grading input changes
  const handleGradingChange = (e) => {
    const { name, value } = e.target;
    setGradingData({ ...gradingData, [name]: value });
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.course) return "Please select a course";
    if (!formData.student) return "Please select a student";
    if (!formData.examType) return "Please select an exam type";
    if (!formData.googleFormLink) return "Please enter a Google Form link";
    if (
      !formData.totalMarks ||
      isNaN(formData.totalMarks) ||
      formData.totalMarks <= 0
    )
      return "Please enter valid total marks";
    if (
      !formData.passingPercentage ||
      isNaN(formData.passingPercentage) ||
      formData.passingPercentage < 0 ||
      formData.passingPercentage > 100
    )
      return "Please enter valid passing percentage (0-100)";
    if (!formData.examDate) return "Please select an exam date";
    return null;
  };

  // Create or update an exam
  const saveExam = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const token = getAuthToken();
      const payload = {
        ...formData,
        totalMarks: Number(formData.totalMarks),
        passingPercentage: Number(formData.passingPercentage),
        examDate: new Date(formData.examDate).toISOString(),
      };

      if (selectedExamId) {
        await axios.put(
          `http://localhost:5000/api/instructor/exams/${selectedExamId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSuccess("Exam updated successfully");
      } else {
        await axios.post(apiUrl, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Exam created successfully");
      }

      // Reset form and refresh data
      resetForm();
      fetchExamsForCourse(formData.course);
    } catch (error) {
      setError(error.response?.data?.message || "Error saving exam");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an exam
  const deleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      await axios.delete(`http://localhost:5000/api/instructor/exams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Exam deleted successfully");
      fetchExamsForCourse(formData.course);
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting exam");
    } finally {
      setIsLoading(false);
    }
  };

  // Grade an exam
  const gradeExam = async (examId) => {
    if (!gradingData.score || isNaN(gradingData.score)) {
      setError("Please enter a valid score");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const payload = {
        score: Number(gradingData.score),
        markedBy: instructorId,
      };

      const response = await axios.put(
        `http://localhost:5000/api/instructor/exams/${examId}/grade`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(response.data.message || "Exam graded successfully");
      fetchExamsForCourse(formData.course);
      setGradingData({ score: "" });
      setSelectedExamId(null);
    } catch (error) {
      setError(error.response?.data?.message || "Error grading exam");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit an exam
  const editExam = (exam) => {
    setFormData({
      course: exam.course._id || exam.course,
      student: exam.student._id || exam.student,
      examType: exam.examType,
      googleFormLink: exam.googleFormLink,
      totalMarks: exam.totalMarks.toString(),
      passingPercentage: exam.passingPercentage.toString(),
      examDate: new Date(exam.examDate).toISOString().split("T")[0],
    });
    setSelectedExamId(exam._id);
    setError(null);
    setSuccess(null);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      course: formData.course, // Keep current course
      student: "",
      examType: "",
      googleFormLink: "",
      totalMarks: "",
      passingPercentage: "",
      examDate: new Date().toISOString().split("T")[0],
    });
    setSelectedExamId(null);
  };

  // Initial data fetch
  useEffect(() => {
    fetchCourses();
    fetchInstructorId();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Instructor Exams</h1>

      {/* Status messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Course Dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Select Course
        </label>
        <select
          name="course"
          value={formData.course}
          onChange={handleCourseChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          disabled={isLoading}
        >
          <option value="">Select a Course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Exam Form */}
      <form
        onSubmit={saveExam}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Student
            </label>
            <select
              name="student"
              value={formData.student}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={!formData.course || isLoading}
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
          </div>

          {/* Exam Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Exam Type
            </label>
            <select
              name="examType"
              value={formData.examType}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isLoading}
            >
              <option value="">Select Exam Type</option>
              <option value="quiz">Quiz</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
            </select>
          </div>

          {/* Google Form Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Google Form Link
            </label>
            <input
              type="url"
              name="googleFormLink"
              placeholder="https://forms.google.com/..."
              value={formData.googleFormLink}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isLoading}
            />
          </div>

          {/* Total Marks */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Marks
            </label>
            <input
              type="number"
              name="totalMarks"
              placeholder="100"
              min="1"
              step="1"
              value={formData.totalMarks}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isLoading}
            />
          </div>

          {/* Passing Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Passing Percentage (0-100)
            </label>
            <input
              type="number"
              name="passingPercentage"
              placeholder="50"
              min="0"
              max="100"
              step="1"
              value={formData.passingPercentage}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isLoading}
            />
          </div>

          {/* Exam Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Exam Date
            </label>
            <input
              type="date"
              name="examDate"
              value={formData.examDate}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-4 flex justify-end space-x-2">
          {selectedExamId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : selectedExamId
              ? "Update Exam"
              : "Create Exam"}
          </button>
        </div>
      </form>

      {/* Exam List */}
      <h2 className="text-xl font-bold mb-4">Exam List</h2>
      {isLoading && !exams.length ? (
        <div className="text-center py-4">Loading exams...</div>
      ) : exams.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {exams.map((exam) => (
            <div key={exam._id} className="border-b border-gray-200 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">
                    {exam.examType.charAt(0).toUpperCase() +
                      exam.examType.slice(1)}{" "}
                    - {exam.student?.name || "Unknown Student"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(exam.examDate).toLocaleDateString()} |
                    Marks: {exam.totalMarks} | Passing: {exam.passingPercentage}
                    %
                  </p>
                  <p className="text-sm">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        exam.status === "pass"
                          ? "text-green-600"
                          : exam.status === "fail"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {exam.status || "pending"}
                    </span>
                    {exam.score !== undefined && ` (Score: ${exam.score})`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => editExam(exam)}
                    className="text-blue-500 hover:text-blue-700 disabled:text-blue-300"
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteExam(exam._id)}
                    className="text-red-500 hover:text-red-700 disabled:text-red-300"
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setGradingData({ score: exam.score?.toString() || "" });
                      setSelectedExamId(exam._id);
                    }}
                    className="text-green-500 hover:text-green-700 disabled:text-green-300"
                    disabled={isLoading || exam.status === "pass"}
                  >
                    Grade
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p>No exams found for the selected course.</p>
        </div>
      )}

      {/* Grading Form */}
      {selectedExamId && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Grade Exam</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              gradeExam(selectedExamId);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Score
                </label>
                <input
                  type="number"
                  name="score"
                  placeholder="Enter score"
                  min="0"
                  value={gradingData.score}
                  onChange={handleGradingChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setSelectedExamId(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Submit Grade"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default InstructorExams;
