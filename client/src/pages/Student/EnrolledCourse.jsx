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
    resourceType: "pdf",
    resourceCategory: "safety",
  });

  // Resource type and category options
  const resourceTypes = [
    { value: "video", label: "Video" },
    { value: "pdf", label: "PDF Document" },
    { value: "quiz", label: "Quiz" },
    { value: "assignment", label: "Assignment" },
  ];

  const resourceCategories = [
    { value: "safety", label: "Safety" },
    { value: "hospitality", label: "Hospitality" },
    { value: "grooming", label: "Grooming" },
  ];

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

  const handleDownload = async (resourceId, fileUrl) => {
    try {
      // Increment download count
      await axios.patch(
        `https://sky-wings-server.vercel.app/api/instructor/resources/${resourceId}/increment-download`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Trigger download
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Refresh resources to update download count
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
      console.error("Download error:", err);
    }
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
        resourceType: "pdf",
        resourceCategory: "safety",
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
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Course Resources</h2>

        {/* Course Selection Dropdown */}
        <div className="space-y-2">
          <label htmlFor="course" className="block text-sm font-medium text-gray-700">
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
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Upload New Resource</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
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

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description*
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="resourceType" className="block text-sm font-medium text-gray-700">
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
                    {resourceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="resourceCategory" className="block text-sm font-medium text-gray-700">
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
                    {resourceCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">
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

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={uploading || !file}
                  className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Upload Resource"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Resources List */}
        {selectedCourse && (
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Course Resources</h3>
              <span className="text-sm text-gray-500">
                {resources.length} resource{resources.length !== 1 ? 's' : ''} found
              </span>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p className="text-gray-500">Loading resources...</p>
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No resources available for this course.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {resources.map((resource) => (
                  <div key={resource._id} className="border p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-lg text-gray-800 truncate">{resource.title}</h4>
                        <p className="text-gray-600 mt-1">{resource.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {resource.resourceType}
                          </span>
                          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {resource.resourceCategory}
                          </span>
                          <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                            Downloads: {resource.downloadCount}
                          </span>
                          {resource.uploadedBy && (
                            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                              Uploaded by: {resource.uploadedBy.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => handleDownload(resource._id, resource.fileUrl)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Uploaded: {new Date(resource.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorResources;
