import { useEffect, useState } from "react";

const ResourceLibrary = ({ courseId }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/course/${courseId}/resources`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch resources");
        }

        const data = await response.json();
        setResources(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [courseId]);

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Resource Library
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading resources...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div
              key={resource._id}
              className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {resource.title}
              </h3>
              <p className="text-gray-600">
                {resource.resourceType.toUpperCase()}
              </p>

              {/* Ensure the correct download link */}
              <a
                href={`http://localhost:5000/uploads/${resource.fileUrl}`}
                className="text-blue-600 font-medium hover:underline mt-2 inline-block"
                download={resource.fileUrl} // Forces download
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No resources available for this course.</p>
      )}
    </section>
  );
};

export default ResourceLibrary;
