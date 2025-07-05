import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CertificateDetails = () => {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [printMode, setPrintMode] = useState(false);

  // Institute information with SVG elements
  const instituteInfo = {
    name: "SkyWings",
    tagline: "Excellence in Air Hostess Training Since 2025",
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 150"
        className="h-16 w-16"
      >
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#75B9E6" />
            <stop offset="100%" stopColor="#3776A9" />
          </linearGradient>
          <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E63946" />
            <stop offset="100%" stopColor="#F77F89" />
          </linearGradient>
        </defs>
        <circle cx="150" cy="75" r="70" fill="url(#skyGradient)" />
        <circle cx="150" cy="75" r="65" fill="white" fillOpacity="0.1" />
        <path
          d="M150 40 C120 60, 70 65, 50 40 C80 70, 120 65, 150 40"
          fill="url(#wingGradient)"
        />
        <path
          d="M150 40 C180 60, 230 65, 250 40 C220 70, 180 65, 150 40"
          fill="url(#wingGradient)"
        />
        <path d="M150 45 L145 80 L155 80 Z" fill="#1A3A5A" />
        <ellipse cx="150" cy="80" rx="15" ry="5" fill="#1A3A5A" />
        <path id="textPath" d="M150,140 A65,65 0 1,1 150.1,140" fill="none" />
        <text
          fill="#1A3A5A"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="16"
          textAnchor="middle"
        >
          <textPath href="#textPath" startOffset="50%">
            SKYWINGS
          </textPath>
        </text>
        <text
          x="150"
          y="115"
          fill="#1A3A5A"
          fontFamily="Arial, sans-serif"
          fontSize="8"
          textAnchor="middle"
        >
          AIR HOSTESS TRAINING INSTITUTE
        </text>
        <path
          d="M70 90 Q 150 100, 230 90"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="2,2"
          fill="none"
        />
      </svg>
    ),
    address: "123 Aviation Avenue, Sky City, 10001",
    website: "www.skywings.edu",
    signature: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 100"
        className="h-12 w-48"
      >
        <rect width="300" height="100" fill="transparent" />
        <path
          d="M30 70 C40 40, 50 35, 60 40 C70 45, 75 60, 80 70 C85 60, 90 50, 100 45 C110 40, 120 50, 130 60 C140 65, 150 70, 160 65 C170 60, 180 50, 190 40 C200 30, 210 25, 220 30 C230 35, 240 45, 245 60 C250 70, 255 80, 260 70"
          fill="none"
          stroke="#003366"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="100" cy="30" r="2" fill="#003366" />
        <path
          d="M30 80 C80 78, 130 82, 260 80"
          fill="none"
          stroke="#003366"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
    seal: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className="h-20 w-20"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#FFF0A5" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
          <pattern
            id="crosshatch"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 0 L8 8 M8 0 L0 8"
              stroke="#D4AF37"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
          </pattern>
        </defs>
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="5"
        />
        <circle cx="100" cy="100" r="90" fill="#1A3A5A" />
        <circle cx="100" cy="100" r="90" fill="url(#crosshatch)" />
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="1"
        />
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="0.5"
        />
        <g fill="url(#goldGradient)">
          <path d="M100 15 L102 20 L107 20 L103 24 L105 29 L100 26 L95 29 L97 24 L93 20 L98 20 Z" />
          <path d="M100 185 L102 180 L107 180 L103 176 L105 171 L100 174 L95 171 L97 176 L93 180 L98 180 Z" />
          <path d="M15 100 L20 98 L20 93 L24 97 L29 95 L26 100 L29 105 L24 103 L20 107 L20 102 Z" />
          <path d="M185 100 L180 98 L180 93 L176 97 L171 95 L174 100 L171 105 L176 103 L180 107 L180 102 Z" />
        </g>
        <path
          d="M100 60 C80 75, 50 78, 40 65 C60 80, 85 75, 100 60"
          fill="url(#goldGradient)"
        />
        <path
          d="M100 60 C120 75, 150 78, 160 65 C140 80, 115 75, 100 60"
          fill="url(#goldGradient)"
        />
        <path d="M100 65 L97 90 L103 90 Z" fill="url(#goldGradient)" />
        <ellipse cx="100" cy="90" rx="10" ry="3" fill="url(#goldGradient)" />
        <path id="topTextPath" d="M100,30 A70,70 0 0,1 170,100" fill="none" />
        <text
          fill="url(#goldGradient)"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="12"
        >
          <textPath href="#topTextPath" startOffset="23%">
            SKYWINGS
          </textPath>
        </text>
        <path
          id="bottomTextPath"
          d="M100,170 A70,70 0 0,0 170,100"
          fill="none"
        />
        <text
          fill="url(#goldGradient)"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="12"
        >
          <textPath href="#bottomTextPath" startOffset="8%">
            INSTITUTE
          </textPath>
        </text>
        <path id="leftTextPath" d="M30,100 A70,70 0 0,0 100,170" fill="none" />
        <text
          fill="url(#goldGradient)"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="10"
        >
          <textPath href="#leftTextPath" startOffset="13%">
            AIR HOSTESS
          </textPath>
        </text>
        <path id="rightTextPath" d="M30,100 A70,70 0 0,1 100,30" fill="none" />
        <text
          fill="url(#goldGradient)"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="10"
        >
          <textPath href="#rightTextPath" startOffset="13%">
            TRAINING
          </textPath>
        </text>
        <text
          x="100"
          y="112"
          fill="url(#goldGradient)"
          fontFamily="Arial, sans-serif"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          EST. 2025
        </text>
        <path
          d="M100 130 Q 120 135, 140 130"
          stroke="url(#goldGradient)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M100 130 Q 80 135, 60 130"
          stroke="url(#goldGradient)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    ),
  };

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://sky-wings-server.vercel.app/api/users/certificate/${certificateId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCertificate(response.data);
        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch certificate"
        );
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-500 p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div
      className={`max-w-4xl mx-auto my-8 px-4 ${printMode ? "print-mode" : ""}`}
    >
      {/* Control buttons - hidden when printing */}
      <div
        className={`mb-6 flex justify-end gap-4 ${printMode ? "hidden" : ""}`}
      >
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Print Certificate
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Back
        </button>
      </div>

      {/* Certificate Document */}
      <div className="bg-white border-8 border-double border-gray-300 rounded-lg shadow-xl p-8 relative">
        {/* Background Pattern - subtle grid */}
        <div className="absolute inset-0 opacity-5 z-0">
          <div className="h-full w-full bg-gradient-to-br from-blue-100 to-blue-50 bg-opacity-50"></div>
        </div>

        {/* Border Design */}
        <div className="absolute inset-2 border-2 border-gray-200 rounded-lg z-0"></div>

        {/* Content Container */}
        <div className="relative z-10">
          {/* Header with Logo */}
          <div className="flex justify-between items-center mb-6">
            <div className="h-16 w-16">{instituteInfo.logo}</div>
            <div className="text-right">
              <p className="text-xs text-gray-500">
                Certificate ID: {certificate.certificateId}
              </p>
              <p className="text-xs text-gray-500">
                Issue Date:{" "}
                {new Date(certificate.issueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Institute Name */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-serif font-bold text-blue-800 tracking-wide">
              {instituteInfo.name}
            </h1>
            <p className="text-sm text-gray-600 italic mt-1">
              {instituteInfo.tagline}
            </p>
          </div>

          {/* Certificate Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-800">
              Certificate of {certificate.certificateType || "Completion"}
            </h2>
            <div className="h-1 w-48 bg-blue-700 mx-auto mt-2"></div>
          </div>

          {/* Award Text */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 mb-2">
              This is to certify that
            </p>
            <h3 className="text-2xl font-bold text-gray-900 font-serif my-3">
              {certificate.studentName}
            </h3>
            <p className="text-lg text-gray-700">
              has successfully completed the course
            </p>
            <h4 className="text-xl font-bold text-blue-800 my-3 px-8">
              {certificate.courseTitle}
            </h4>
            <p className="text-base text-gray-600 italic max-w-2xl mx-auto mt-2">
              {certificate.courseDescription}
            </p>
          </div>

          {/* Additional Details */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600">
              with a validity period of{" "}
              <span className="font-medium">{certificate.validityPeriod}</span>
            </p>
            <p className="text-sm text-gray-600">
              Student Email:{" "}
              <span className="font-medium">{certificate.studentEmail}</span>
            </p>
          </div>

          {/* Signatures Section */}
          <div className="flex justify-between items-end mt-12 pt-6">
            <div className="text-center">
              <div className="h-12 w-48 mx-auto mb-1">
                {instituteInfo.signature}
              </div>
              <div className="w-40 border-t border-gray-400 pt-1">
                <p className="text-sm font-medium">Program Director</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-20 w-20 mb-2 opacity-90">
                {instituteInfo.seal}
              </div>
            </div>

            <div className="text-center">
              <div className="h-12 w-48 mx-auto mb-1">
                {instituteInfo.signature}
              </div>
              <div className="w-40 border-t border-gray-400 pt-1">
                <p className="text-sm font-medium">Registrar</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-10 pt-4 border-t border-gray-200">
            <p>{instituteInfo.address}</p>
            <p className="mt-1">{instituteInfo.website}</p>
            <p className="mt-2">
              Verify this certificate at {instituteInfo.website}/verify
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles - These will only be applied when printing */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            body { background-color: white; }
            .print-mode { padding: 0; margin: 0; }
            @page { size: portrait; margin: 0.5cm; }
          }
        `,
        }}
      />
    </div>
  );
};

export default CertificateDetails;
