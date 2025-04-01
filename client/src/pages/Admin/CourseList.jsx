import React, { useEffect, useState } from "react";
import axios from "axios";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]); // State for instructors
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructors: [],
    schedule: "",
    fees: "",
    maxParticipants: "",
    category: "",
    prerequisites: [],
    courseLevel: "",
    courseDuration: "",
    courseType: "",
    image: null,
  });

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "https://sky-wings-server.vercel.app/api/admin/courses",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // Fetch all instructors
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get(
          "https://sky-wings-server.vercel.app/api/admin/instructors",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setInstructors(response.data);
      } catch (error) {
        console.error("Failed to fetch instructors:", error);
      }
    };
    fetchInstructors();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input for course image
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submission for adding a new course
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "instructors" || key === "prerequisites") {
          formData[key].forEach((item) => formDataToSend.append(key, item));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        "https://sky-wings-server.vercel.app/api/admin/courses",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Course added successfully!");
      setCourses([...courses, response.data.course]);
      setShowAddCourseForm(false);
      setFormData({
        title: "",
        description: "",
        instructors: [],
        schedule: "",
        fees: "",
        maxParticipants: "",
        category: "",
        prerequisites: [],
        courseLevel: "",
        courseDuration: "",
        courseType: "",
        image: null,
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add course");
    }
  };

  // Handle viewing enrolled students for a course
  const handleViewEnrolled = async (courseId) => {
    try {
      const response = await axios.get(
        `https://sky-wings-server.vercel.app/api/admin/courses/${courseId}/enrolled`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEnrolledStudents(response.data);
      setSelectedCourse(courseId);
    } catch (error) {
      console.error("Failed to fetch enrolled students:", error);
    }
  };

  // Handle deleting a course
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(
          `https://sky-wings-server.vercel.app/api/admin/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCourses(courses.filter((course) => course._id !== courseId));
        alert("Course deleted successfully!");
      } catch (error) {
        console.error("Failed to delete course:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Course Management</h1>

      {/* Button to toggle the Add Course form */}
      <button
        onClick={() => setShowAddCourseForm(!showAddCourseForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        {showAddCourseForm ? "Hide Form" : "Add Course"}
      </button>

      {/* Add Course Form */}
      {showAddCourseForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Instructors</label>
            <select
              name="instructors"
              multiple
              value={formData.instructors}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  instructors: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
              className="w-full p-2 border rounded"
              required
            >
              {instructors.map((instructor) => (
                <option key={instructor._id} value={instructor._id}>
                  {instructor.name} ({instructor.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Schedule</label>
            <input
              type="datetime-local"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Fees</label>
            <input
              type="number"
              name="fees"
              value={formData.fees}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Max Participants</label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Prerequisites</label>
            <input
              type="text"
              name="prerequisites"
              value={formData.prerequisites.join(",")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prerequisites: e.target.value.split(","),
                })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Course Level</label>
            <select
              name="courseLevel"
              value={formData.courseLevel}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Course Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Course Duration</label>
            <input
              type="text"
              name="courseDuration"
              value={formData.courseDuration}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Course Type</label>
            <select
              name="courseType"
              value={formData.courseType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Course Type</option>
              <option value="live">Live</option>
              <option value="self-paced">Self-Paced</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Course Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Course
          </button>
        </form>
      )}

      {/* Course List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Instructors</th>
              <th className="px-4 py-2 border">Schedule</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="text-center">
                <td className="px-4 py-2 border">{course.title}</td>
                <td className="px-4 py-2 border">{course.description}</td>
                <td className="px-4 py-2 border">
                  {course.instructors
                    .map((instructor) => instructor.name)
                    .join(", ")}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(course.schedule).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleViewEnrolled(course._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Enrolled
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enrolled Students Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Enrolled Students</h2>
            <ul>
              {enrolledStudents.map((student) => (
                <li key={student._id} className="mb-2">
                  {student.name} ({student.email})
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedCourse(null)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;
