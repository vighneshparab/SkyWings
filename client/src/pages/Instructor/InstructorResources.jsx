import React, { useState, useEffect } from "react";
import axios from "axios";

const InstructorResources = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    resourceType: "document",
    resourceCategory: "lecture",
  });

  // Fetch courses taught by the instructor
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://sky-wings-server.vercel.app/api/instructor/courses",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCourses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch courses");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch resources when course is selected
  useEffect(() => {
    if (selectedCourse) {
      const fetchResources = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `https://sky-wings-server.vercel.app/api/instructor/courses/resources?courseId=${selectedCourse}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setResources(response.data.resources);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch resources");
        } finally {
          setIsLoading(false);
        }
      };
      fetchResources();
    }
  }, [selectedCourse]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !file) return;

    try {
      setUploading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("resourceType", formData.resourceType);
      formDataToSend.append("resourceCategory", formData.resourceCategory);
      formDataToSend.append("courseId", selectedCourse);

      const response = await axios.post(
        "https://sky-wings-server.vercel.app/api/instructor/courses/resources",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh resources after upload
      const resourcesResponse = await axios.get(
        `https://sky-wings-server.vercel.app/api/instructor/courses/resources?courseId=${selectedCourse}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setResources(resourcesResponse.data.resources);

      // Reset form
      setFormData({
        title: "",
        description: "",
        resourceType: "document",
        resourceCategory: "lecture",
      });
      setFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload resource");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold">Course Resources</h2>

      {/* Course Selection Dropdown */}
      <div className="space-y-2">
        <label
          htmlFor="course"
          className="block text-sm font-medium text-gray-700"
        >
          Select Course
        </label>
        <select
          id="course"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          disabled={isLoading}
        >
          <option value="">-- Select a course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name} ({course.code})
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Upload Resource Form */}
      {selectedCourse && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Upload New Resource</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="resourceType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Resource Type*
                </label>
                <select
                  id="resourceType"
                  name="resourceType"
                  required
                  value={formData.resourceType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="document">Document</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="link">Link</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="resourceCategory"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category*
                </label>
                <select
                  id="resourceCategory"
                  name="resourceCategory"
                  required
                  value={formData.resourceCategory}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="lecture">Lecture Material</option>
                  <option value="assignment">Assignment</option>
                  <option value="reading">Reading</option>
                  <option value="reference">Reference</option>
                  <option value="solution">Solution</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700"
              >
                File*
              </label>
              <input
                type="file"
                id="file"
                name="file"
                required
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={uploading || !file}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload Resource"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resources List */}
      {selectedCourse && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Course Resources</h3>
          {isLoading ? (
            <p>Loading resources...</p>
          ) : resources.length === 0 ? (
            <p className="text-gray-500">
              No resources available for this course.
            </p>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => (
                <div
                  key={resource._id}
                  className="border p-4 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-lg">{resource.title}</h4>
                      <p className="text-gray-600">{resource.description}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                          {resource.resourceType}
                        </span>
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">
                          {resource.resourceCategory}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={`https://sky-wings-server.vercel.app/uploads/${resource.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Uploaded:{" "}
                    {new Date(resource.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InstructorResources;
