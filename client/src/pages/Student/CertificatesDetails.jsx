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
        className="h-20 w-20"
      >
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
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
        <path d="M150 45 L145 80 L155 80 Z" fill="#1e293b" />
        <ellipse cx="150" cy="80" rx="15" ry="5" fill="#1e293b" />
        <path id="textPath" d="M150,140 A65,65 0 1,1 150.1,140" fill="none" />
        <text
          fill="#1e293b"
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
          fill="#1e293b"
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
        className="h-16 w-48"
      >
        <rect width="300" height="100" fill="transparent" />
        <path
          d="M30 70 C40 40, 50 35, 60 40 C70 45, 75 60, 80 70 C85 60, 90 50, 100 45 C110 40, 120 50, 130 60 C140 65, 150 70, 160 65 C170 60, 180 50, 190 40 C200 30, 210 25, 220 30 C230 35, 240 45, 245 60 C250 70, 255 80, 260 70"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="100" cy="30" r="2" fill="#4f46e5" />
        <path
          d="M30 80 C80 78, 130 82, 260 80"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    seal: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className="h-24 w-24"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <radialGradient id="sealGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="6"
        />
        <circle cx="100" cy="100" r="85" fill="url(#sealGradient)" />
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="2"
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
        <text
          x="100"
          y="112"
          fill="url(#goldGradient)"
          fontFamily="Arial, sans-serif"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
        >
          OFFICIAL SEAL
        </text>
        <text
          x="100"
          y="125"
          fill="url(#goldGradient)"
          fontFamily="Arial, sans-serif"
          fontSize="8"
          textAnchor="middle"
        >
          EST. 2025
        </text>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-700 font-medium">Error loading certificate</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${printMode ? "print-mode" : ""}`}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Control buttons - hidden when printing */}
        <div className={`mb-8 flex justify-between items-center ${printMode ? "hidden" : ""}`}>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Certificate Details</h1>
            <p className="text-slate-600 mt-1">Official training certificate</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Certificate
            </button>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>
        </div>

        {/* Certificate Document */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Decorative Header */}
          <div className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500"></div>
          
          {/* Certificate Content */}
          <div className="p-12 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="h-full w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50"></div>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute top-6 left-6 w-16 h-16 border-l-4 border-t-4 border-indigo-200 rounded-tl-xl"></div>
            <div className="absolute top-6 right-6 w-16 h-16 border-r-4 border-t-4 border-indigo-200 rounded-tr-xl"></div>
            <div className="absolute bottom-6 left-6 w-16 h-16 border-l-4 border-b-4 border-indigo-200 rounded-bl-xl"></div>
            <div className="absolute bottom-6 right-6 w-16 h-16 border-r-4 border-b-4 border-indigo-200 rounded-br-xl"></div>

            {/* Content Container */}
            <div className="relative z-10">
              {/* Header with Logo and Info */}
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center space-x-4">
                  {instituteInfo.logo}
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {instituteInfo.name}
                    </h1>
                    <p className="text-slate-600 italic text-lg mt-1">
                      {instituteInfo.tagline}
                    </p>
                  </div>
                </div>
                <div className="text-right bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500 font-medium">Certificate ID</p>
                  <p className="text-lg font-bold text-slate-700">{certificate.certificateId}</p>
                  <p className="text-sm text-slate-500 mt-2">Issue Date</p>
                  <p className="text-base font-semibold text-slate-700">
                    {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Certificate Title */}
              <div className="text-center mb-12">
                <div className="inline-block">
                  <h2 className="text-4xl font-bold text-slate-800 mb-2">
                    CERTIFICATE OF {(certificate.certificateType || "COMPLETION").toUpperCase()}
                  </h2>
                  <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                </div>
              </div>

              {/* Award Text */}
              <div className="text-center mb-12 space-y-6">
                <p className="text-xl text-slate-600 font-light">
                  This is to certify that
                </p>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-100">
                  <h3 className="text-4xl font-bold text-slate-800 font-serif tracking-wide">
                    {certificate.studentName}
                  </h3>
                </div>
                
                <p className="text-xl text-slate-600 font-light">
                  has successfully completed the course
                </p>
                
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-100">
                  <h4 className="text-2xl font-bold text-slate-800 leading-relaxed">
                    {certificate.courseTitle}
                  </h4>
                  <p className="text-lg text-slate-600 mt-3 italic max-w-3xl mx-auto">
                    {certificate.courseDescription}
                  </p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="text-center mb-12 space-y-3">
                <div className="inline-flex items-center space-x-2 bg-slate-50 px-6 py-3 rounded-full">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-700">
                    <span className="font-medium">Validity:</span> {certificate.validityPeriod}
                  </span>
                </div>
                <div className="inline-flex items-center space-x-2 bg-slate-50 px-6 py-3 rounded-full">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <span className="text-slate-700">
                    <span className="font-medium">Email:</span> {certificate.studentEmail}
                  </span>
                </div>
              </div>

              {/* Signatures Section */}
              <div className="flex justify-between items-end mt-16 pt-8 border-t border-slate-200">
                <div className="text-center">
                  <div className="mb-3">
                    {instituteInfo.signature}
                  </div>
                  <div className="w-48 border-t-2 border-slate-300 pt-2">
                    <p className="text-base font-semibold text-slate-700">Program Director</p>
                    <p className="text-sm text-slate-500">SkyWings Institute</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="mb-2">
                    {instituteInfo.seal}
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Official Seal</p>
                </div>

                <div className="text-center">
                  <div className="mb-3">
                    {instituteInfo.signature}
                  </div>
                  <div className="w-48 border-t-2 border-slate-300 pt-2">
                    <p className="text-base font-semibold text-slate-700">Registrar</p>
                    <p className="text-sm text-slate-500">SkyWings Institute</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-12 pt-8 border-t border-slate-200">
                <div className="bg-slate-50 p-6 rounded-xl">
                  <p className="text-slate-600 font-medium">{instituteInfo.address}</p>
                  <p className="text-slate-600 mt-2">{instituteInfo.website}</p>
                  <p className="text-sm text-slate-500 mt-4">
                    Verify this certificate at{" "}
                    <span className="font-medium text-indigo-600">
                      {instituteInfo.website}/verify
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            body { 
              background-color: white !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-mode { 
              padding: 0 !important; 
              margin: 0 !important; 
              min-height: auto !important;
              background: white !important;
            }
            @page { 
              size: A4 portrait; 
              margin: 0.5cm; 
            }
            .shadow-2xl {
              box-shadow: none !important;
            }
            .rounded-2xl {
              border-radius: 0 !important;
            }
          }
        `,
        }}
      />
    </div>
  );
};

export default CertificateDetails;
