import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CertificateDetails = () => {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [printMode, setPrintMode] = useState(false);

  // Institute information with enhanced SVG elements
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
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="dropShadow">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
          </filter>
        </defs>
        <circle cx="150" cy="75" r="70" fill="url(#skyGradient)" filter="url(#dropShadow)" />
        <circle cx="150" cy="75" r="65" fill="white" fillOpacity="0.1" />
        <path
          d="M150 40 C120 60, 70 65, 50 40 C80 70, 120 65, 150 40"
          fill="url(#wingGradient)"
          filter="url(#dropShadow)"
        />
        <path
          d="M150 40 C180 60, 230 65, 250 40 C220 70, 180 65, 150 40"
          fill="url(#wingGradient)"
          filter="url(#dropShadow)"
        />
        <path d="M150 45 L145 80 L155 80 Z" fill="#1e3a8a" />
        <ellipse cx="150" cy="80" rx="15" ry="5" fill="#1e3a8a" />
        <path id="textPath" d="M150,140 A65,65 0 1,1 150.1,140" fill="none" />
        <text
          fill="white"
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
          fill="white"
          fontFamily="Arial, sans-serif"
          fontSize="8"
          textAnchor="middle"
        >
          AIR HOSTESS TRAINING INSTITUTE
        </text>
        <path
          d="M70 90 Q 150 100, 230 90"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="3,3"
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
        className="h-16 w-56"
      >
        <defs>
          <linearGradient id="signatureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <rect width="300" height="100" fill="transparent" />
        <path
          d="M30 70 C40 40, 50 35, 60 40 C70 45, 75 60, 80 70 C85 60, 90 50, 100 45 C110 40, 120 50, 130 60 C140 65, 150 70, 160 65 C170 60, 180 50, 190 40 C200 30, 210 25, 220 30 C230 35, 240 45, 245 60 C250 70, 255 80, 260 70"
          fill="none"
          stroke="url(#signatureGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="100" cy="30" r="2" fill="#1e40af" />
        <path
          d="M30 80 C80 78, 130 82, 260 80"
          fill="none"
          stroke="url(#signatureGradient)"
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
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <radialGradient id="sealBackground" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </radialGradient>
          <filter id="goldGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="6"
          filter="url(#goldGlow)"
        />
        <circle cx="100" cy="100" r="90" fill="url(#sealBackground)" />
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="2"
        />
        <circle
          cx="100"
          cy="100"
          r="78"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="1"
          strokeDasharray="5,2"
        />
        
        {/* Enhanced decorative stars */}
        <g fill="url(#goldGradient)" filter="url(#goldGlow)">
          <path d="M100 20 L102 25 L107 25 L103 29 L105 34 L100 31 L95 34 L97 29 L93 25 L98 25 Z" />
          <path d="M100 180 L102 175 L107 175 L103 171 L105 166 L100 169 L95 166 L97 171 L93 175 L98 175 Z" />
          <path d="M20 100 L25 98 L25 93 L29 97 L34 95 L31 100 L34 105 L29 103 L25 107 L25 102 Z" />
          <path d="M180 100 L175 98 L175 93 L171 97 L166 95 L169 100 L166 105 L171 103 L175 107 L175 102 Z" />
        </g>
        
        {/* Enhanced wings */}
        <path
          d="M100 65 C80 75, 50 78, 40 70 C60 85, 85 80, 100 65"
          fill="url(#goldGradient)"
          filter="url(#goldGlow)"
        />
        <path
          d="M100 65 C120 75, 150 78, 160 70 C140 85, 115 80, 100 65"
          fill="url(#goldGradient)"
          filter="url(#goldGlow)"
        />
        <path d="M100 70 L97 95 L103 95 Z" fill="url(#goldGradient)" />
        <ellipse cx="100" cy="95" rx="12" ry="4" fill="url(#goldGradient)" />
        
        {/* Enhanced text paths */}
        <path id="topTextPath" d="M100,35 A65,65 0 0,1 165,100" fill="none" />
        <text
          fill="url(#goldGradient)"
          fontFamily="serif"
          fontWeight="bold"
          fontSize="14"
          filter="url(#goldGlow)"
        >
          <textPath href="#topTextPath" startOffset="20%">
            SKYWINGS
          </textPath>
        </text>
        <path
          id="bottomTextPath"
          d="M100,165 A65,65 0 0,0 165,100"
          fill="none"
        />
        <text
          fill="url(#goldGradient)"
          fontFamily="serif"
          fontWeight="bold"
          fontSize="14"
          filter="url(#goldGlow)"
        >
          <textPath href="#bottomTextPath" startOffset="5%">
            INSTITUTE
          </textPath>
        </text>
        <text
          x="100"
          y="115"
          fill="url(#goldGradient)"
          fontFamily="serif"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
          filter="url(#goldGlow)"
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-600 p-6 bg-red-50 rounded-xl border border-red-200">
        <div className="text-lg font-semibold mb-2">Error Loading Certificate</div>
        <div className="text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto my-8 px-4 ${printMode ? "print-mode" : ""}`}>
      {/* Enhanced Control buttons */}
      <div className={`mb-8 flex justify-end gap-4 ${printMode ? "hidden" : ""}`}>
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Certificate
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      {/* Enhanced Certificate Document */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Elegant border design */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
        <div className="absolute inset-4 border-4 border-double border-blue-200 rounded-xl"></div>
        <div className="absolute inset-6 border border-blue-100 rounded-lg"></div>
        
        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full opacity-10"></div>
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-bl from-blue-600 to-blue-800 rounded-full opacity-10"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-blue-600 to-blue-800 rounded-full opacity-10"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-tl from-blue-600 to-blue-800 rounded-full opacity-10"></div>

        {/* Content Container */}
        <div className="relative z-10 p-12">
          {/* Enhanced Header */}
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-4">
              {instituteInfo.logo}
              <div>
                <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                  {instituteInfo.name}
                </h1>
                <p className="text-sm text-gray-600 italic font-medium mt-1">
                  {instituteInfo.tagline}
                </p>
              </div>
            </div>
            <div className="text-right bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700 font-semibold mb-1">Certificate ID</p>
              <p className="text-sm font-mono text-blue-900 mb-2">{certificate.certificateId}</p>
              <p className="text-xs text-blue-700 font-semibold mb-1">Issue Date</p>
              <p className="text-sm text-blue-900 font-medium">
                {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Enhanced Certificate Title */}
          <div className="text-center mb-12">
            <div className="inline-block">
              <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 bg-clip-text text-transparent uppercase tracking-wider mb-4">
                Certificate of {certificate.certificateType || "Completion"}
              </h2>
              <div className="flex justify-center items-center gap-4">
                <div className="h-1 w-20 bg-gradient-to-r from-transparent to-blue-600"></div>
                <div className="h-2 w-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full"></div>
                <div className="h-1 w-20 bg-gradient-to-l from-transparent to-blue-600"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Award Text */}
          <div className="text-center mb-12">
            <p className="text-xl text-gray-700 mb-6 font-serif">
              This is to certify that
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 mb-6">
              <h3 className="text-4xl font-serif font-bold text-blue-900 mb-2">
                {certificate.studentName}
              </h3>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto rounded-full"></div>
            </div>
            <p className="text-xl text-gray-700 mb-4 font-serif">
              has successfully completed the course
            </p>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 mb-6">
              <h4 className="text-2xl font-bold text-blue-800 mb-3 font-serif">
                {certificate.courseTitle}
              </h4>
              <p className="text-base text-gray-700 italic max-w-3xl mx-auto leading-relaxed">
                {certificate.courseDescription}
              </p>
            </div>
          </div>

          {/* Enhanced Additional Details */}
          <div className="text-center mb-12">
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700 font-semibold mb-1">Validity Period</p>
                <p className="text-base font-medium text-blue-900">{certificate.validityPeriod}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700 font-semibold mb-1">Student Email</p>
                <p className="text-base font-medium text-blue-900">{certificate.studentEmail}</p>
              </div>
            </div>
          </div>

          {/* Enhanced Signatures Section */}
          <div className="flex justify-between items-end mt-16 pt-8">
            <div className="text-center">
              <div className="h-16 w-56 mx-auto mb-4">
                {instituteInfo.signature}
              </div>
              <div className="border-t-2 border-blue-300 pt-3 w-48 mx-auto">
                <p className="text-sm font-bold text-blue-900 mb-1">Dr. Sarah Johnson</p>
                <p className="text-xs text-blue-700 font-semibold">Program Director</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-24 w-24 mb-4">
                {instituteInfo.seal}
              </div>
              <p className="text-xs text-blue-700 font-semibold">Official Seal</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-56 mx-auto mb-4">
                {instituteInfo.signature}
              </div>
              <div className="border-t-2 border-blue-300 pt-3 w-48 mx-auto">
                <p className="text-sm font-bold text-blue-900 mb-1">Prof. Michael Chen</p>
                <p className="text-xs text-blue-700 font-semibold">Registrar</p>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="text-center mt-12 pt-8 border-t border-blue-200">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800 font-semibold mb-2">{instituteInfo.address}</p>
              <p className="text-sm text-blue-700 mb-3">{instituteInfo.website}</p>
              <p className="text-xs text-blue-600 bg-blue-100 px-4 py-2 rounded-full inline-block">
                Verify this certificate at {instituteInfo.website}/verify
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Print Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            body { 
              background-color: white; 
              font-size: 12pt;
              line-height: 1.4;
            }
            .print-mode { 
              padding: 0; 
              margin: 0; 
              max-width: none;
            }
            @page { 
              size: landscape A4; 
              margin: 0.5cm; 
            }
            .shadow-2xl,
            .shadow-xl,
            .shadow-lg,
            .shadow-md {
              box-shadow: none !important;
            }
            .rounded-2xl,
            .rounded-xl,
            .rounded-lg {
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
