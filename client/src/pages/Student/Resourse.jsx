import { useEffect, useState } from "react";

const ResourceLibrary = ({ courseId }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://sky-wings-server.vercel.app/api/course/${courseId}/resources`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch resources: ${response.statusText}`);
        }

        const data = await response.json();
        setResources(data.resources || data); // Handle both formats
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchResources();
    }
  }, [courseId]);

  const handleDownload = async (resourceId, fileUrl) => {
    try {
      // First increment download count
      await fetch(
        `https://sky-wings-server.vercel.app/api/resources/${resourceId}/increment-download`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Then trigger download
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", "");
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download resource");
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Resource Library</h2>
        {!loading && resources.length > 0 && (
          <span className="text-sm text-gray-500">
            {resources.length} resource{resources.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <p className="text-gray-600">Loading resources...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
          {error}
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div
              key={resource._id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {resource.description}
                    </p>
                  </div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {resource.resourceType}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {resource.resourceCategory}
                  </span>
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                    Downloads: {resource.downloadCount || 0}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Uploaded: {new Date(resource.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDownload(resource._id, resource.fileUrl)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No resources available for this course.</p>
        </div>
      )}
    </section>
  );
};

export default ResourceLibrary;
