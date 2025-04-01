import React, { useState, useEffect } from "react";
import axios from "axios";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://sky-wings-server.vercel.app/course/certificates",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCertificates(response.data);
        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch certificates"
        );
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Certificates
      </h2>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <div
              key={certificate._id}
              className="border border-gray-200 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-gray-50"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {certificate.course.title}
              </h3>
              <p className="text-gray-700 mt-2 text-sm">
                {certificate.course.description}
              </p>
              <div className="mt-4 border-t pt-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">
                    Certificate ID:
                  </span>{" "}
                  {certificate.certificateId}
                </p>
                <a
                  href={`/certificate/${certificate._id}`}
                  className="text-blue-600 font-medium hover:underline mt-2 inline-block"
                >
                  View Certificate
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No certificates issued yet.</p>
      )}
    </section>
  );
};

export default Certificates;
