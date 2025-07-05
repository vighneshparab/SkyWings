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
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle cx="150" cy="75" r="72" fill="url(#skyGradient)" filter="url(#glow)" />
        <circle cx="150" cy="75" r="68" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
        <path
          d="M150 35 C115 60, 65 65, 45 35 C75 75, 120 68, 150 35"
          fill="url(#wingGradient)"
          filter="url(#glow)"
        />
        <path
          d="M150 35 C185 60, 235 65, 255 35 C225 75, 180 68, 150 35"
          fill="url(#wingGradient)"
          filter="url(#glow)"
        />
        <path d="M150 42 L146 85 L154 85 Z" fill="#1e3a8a" />
        <ellipse cx="150" cy="85" rx="18" ry="6" fill="#1e3a8a" />
        <path id="textPath" d="M150,145 A70,70 0 1,1 150.1,145" fill="none" />
        <text
          fill="white"
          fontFamily="Georgia, serif"
          fontWeight="bold"
          fontSize="18"
          textAnchor="middle"
        >
          <textPath href="#textPath" startOffset="50%">
            SKYWINGS
          </textPath>
        </text>
        <text
          x="150"
          y="120"
          fill="white"
          fontFamily="Georgia, serif"
          fontSize="10"
          textAnchor="middle"
          fontWeight="600"
        >
          AIR HOSTESS TRAINING INSTITUTE
        </text>
        <path
          d="M70 95 Q 150 105, 230 95"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="3,3"
          fill="none"
          opacity="0.7"
        />
      </svg>
    ),
    address: "123 Aviation Avenue, Sky City, 10001",
    website: "www.skywings.edu",
    signature: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 100"
        className="h-16 w-52"
      >
        <defs>
          <linearGradient id="inkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
        <rect width="300" height="100" fill="transparent" />
        <path
          d="M25 65 C35 35, 45 30, 55 35 C65 40, 70 55, 75 65 C80 55, 85 45, 95 40 C105 35, 115 45, 125 55 C135 60, 145 65, 155 60 C165 55, 175 45, 185 35 C195 25, 205 20, 215 25 C225 30, 235 40, 240 55 C245 65, 250 75, 255 65"
          fill="none"
          stroke="url(#inkGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="95" cy="25" r="2.5" fill="url(#inkGradient)" />
        <path
          d="M25 75 C75 73, 125 77, 255 75"
          fill="none"
          stroke="url(#inkGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M140 30 C150 25, 160 28, 170 35 C175 40, 180 50, 185 60"
          fill="none"
          stroke="url(#inkGradient)"
          strokeWidth="2"
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
            <stop offset="30%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <pattern
            id="elegantPattern"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="6" cy="6" r="1" fill="url(#goldGradient)" opacity="0.3" />
            <path
              d="M0 6 L12 6 M6 0 L6 12"
              stroke="url(#goldGradient)"
              strokeWidth="0.3"
              strokeOpacity="0.2"
            />
          </pattern>
          <filter id="emboss">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="3" dy="3" result="offset"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2"/>
            </feComponentTransfer>
          </filter>
        </defs>
        
        {/* Outer decorative ring */}
        <circle
          cx="100"
          cy="100"
          r="98"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="4"
        />
        
        {/* Main seal background */}
        <circle cx="100" cy="100" r="92" fill="url(#blueGradient)" />
        <circle cx="100" cy="100" r="92" fill="url(#elegantPattern)" />
        
        {/* Inner decorative rings */}
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="1.5"
        />
        <circle
          cx="100"
          cy="100"
          r="82"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="0.8"
          strokeDasharray="3,2"
        />
        
        {/* Corner decorative elements */}
        <g fill="url(#goldGradient)">
          <path d="M100 12 L104 22 L114 22 L106 28 L110 38 L100 32 L90 38 L94 28 L86 22 L96 22 Z" />
          <path d="M100 188 L104 178 L114 178 L106 172 L110 162 L100 168 L90 162 L94 172 L86 178 L96 178 Z" />
          <path d="M12 100 L22 96 L22 86 L28 94 L38 90 L32 100 L38 110 L28 106 L22 114 L22 104 Z" />
          <path d="M188 100 L178 96 L178 86 L172 94 L162 90 L168 100 L162 110 L172 106 L178 114 L178 104 Z" />
        </g>
        
        {/* Central emblem - enhanced wings */}
        <path
          d="M100 55 C75 75, 45 78, 25 60 C50 85, 85 80, 100 55"
          fill="url(#goldGradient)"
          filter="url(#emboss)"
        />
        <path
          d="M100 55 C125 75, 155 78, 175 60 C150 85, 115 80, 100 55"
          fill="url(#goldGradient)"
          filter="url(#emboss)"
        />
        <path d="M100 62 L96 95 L104 95 Z" fill="url(#goldGradient)" />
        <ellipse cx="100" cy="95" rx="12" ry="4" fill="url(#goldGradient)" />
        
        {/* Text around the seal */}
        <path id="topTextPath" d="M100,25 A75,75 0 0,1 175,100" fill="none" />
        <text
          fill="url(#goldGradient)"
          fontFamily="Georgia, serif"
          fontWeight="bold"
          fontSize="14"
          letterSpacing="1px"
        >
          <textPath href="#topTextPath" startOffset="20%">
            SKYWINGS
          </textPath>
        </text>
        
        <path
          id="bottomTextPath"
          d="M100,175 A75,75 0 0,0 175,100"
          fill="none"
        />
        <text
          fill="url(#goldGradient)"
          fontFamily="Georgia, serif"
          fontWeight="bold"
          fontSize="14"
          letterSpacing="1px"
        >
          <textPath href="#bottomTextPath" startOffset="5%">
            INSTITUTE
          </textPath>
        </text>
        
        <path id="leftTextPath" d="M25,100 A75,75 0 0,0 100,175" fill="none" />
        <text
          fill="url(#goldGradient)"
          fontFamily="Georgia, serif"
          fontWeight="bold"
          fontSize="11"
          letterSpacing="0.5px"
        >
          <textPath href="#leftTextPath" startOffset="10%">
            AIR HOSTESS
          </textPath>
        </text>
        
        <path id="rightTextPath" d="M25,100 A75,75 0 0,1 100,25" fill="none" />
        <text
          fill="url(#goldGradient)"
          fontFamily="Georgia, serif"
          fontWeight="bold"
          fontSize="11"
          letterSpacing="0.5px"
        >
          <textPath href="#rightTextPath" startOffset="10%">
            TRAINING
          </textPath>
        </text>
        
        <text
          x="100"
          y="118"
          fill="url(#goldGradient)"
          fontFamily="Georgia, serif"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
        >
          EST. 2025
        </text>
        
        {/* Decorative flourishes */}
        <path
          d="M100 135 Q 125 140, 150 135"
          stroke="url(#goldGradient)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M100 135 Q 75 140, 50 135"
          stroke="url(#goldGradient)"
          strokeWidth="1.5"
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
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-600 p-6 bg-red-50 rounded-xl border border-red-200">
        <div className="text-xl font-semibold mb-2">Error Loading Certificate</div>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-5xl mx-auto my-8 px-4 ${printMode ? "print-mode" : ""}`}
    >
      {/* Control buttons - hidden when printing */}
      <div
        className={`mb-8 flex justify-end gap-4 ${printMode ? "hidden" : ""}`}
      >
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
        >
          🖨️ Print Certificate
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
        >
          ← Back
        </button>
      </div>

      {/* Certificate Document */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden relative">
        {/* Elegant border frame */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
        <div className="absolute inset-4 border-4 border-double border-blue-200 rounded-lg"></div>
        <div className="absolute inset-6 border border-blue-100 rounded-lg"></div>
        
        {/* Decorative corner elements */}
        <div className="absolute top-6 left-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full opacity-10"></div>
        <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full opacity-10"></div>
        <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full opacity-10"></div>
        <div className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full opacity-10"></div>

        {/* Content Container */}
        <div className="relative z-10 p-12">
          {/* Header with Logo */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-4">
              {instituteInfo.logo}
              <div>
                <h1 className="text-2xl font-bold text-blue-900 tracking-wide">
                  {instituteInfo.name}
                </h1>
                <p className="text-sm text-blue-600 font-medium">
                  {instituteInfo.tagline}
                </p>
              </div>
            </div>
            <div className="text-right bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-800 mb-1">
                Certificate ID
              </p>
              <p className="text-xs text-blue-600 font-mono bg-white px-2 py-1 rounded">
                {certificate.certificateId}
              </p>
              <p className="text-sm font-semibold text-blue-800 mt-2 mb-1">
                Issue Date
              </p>
              <p className="text-xs text-blue-600">
                {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center mb-10">
            <div className="inline-block">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600 tracking-wider mb-2">
                CERTIFICATE
              </h2>
              <h3 className="text-xl font-semibold text-gray-700 tracking-widest">
                OF {certificate.certificateType?.toUpperCase() || "COMPLETION"}
              </h3>
              <div className="flex justify-center mt-4">
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Award Text */}
          <div className="text-center mb-10">
            <p className="text-lg text-gray-600 mb-6 font-medium">
              This is to certify that
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200 mb-6">
              <h3 className="text-4xl font-bold text-blue-900 font-serif tracking-wide">
                {certificate.studentName}
              </h3>
            </div>
            
            <p className="text-lg text-gray-600 mb-6 font-medium">
              has successfully completed the comprehensive training program
            </p>
            
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border border-gray-200 mb-6">
              <h4 className="text-2xl font-bold text-blue-800 mb-3 font-serif">
                {certificate.courseTitle}
              </h4>
              <p className="text-base text-gray-700 leading-relaxed max-w-3xl mx-auto">
                {certificate.courseDescription}
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 inline-block">
              <p className="text-sm text-gray-700 font-medium">
                <span className="text-yellow-700 font-semibold">Validity Period:</span> {certificate.validityPeriod}
              </p>
            </div>
          </div>

          {/* Student Information */}
          <div className="text-center mb-12">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 inline-block">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Student Email:</span>{" "}
                <span className="font-mono text-blue-600">{certificate.studentEmail}</span>
              </p>
            </div>
          </div>

          {/* Signatures Section */}
          <div className="flex justify-between items-end mt-16 pt-8 border-t border-gray-200">
            <div className="text-center flex-1">
              <div className="h-16 w-52 mx-auto mb-4">
                {instituteInfo.signature}
              </div>
              <div className="border-t-2 border-blue-600 pt-2 mx-auto w-48">
                <p className="text-sm font-bold text-blue-900">Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-600 font-semibold">Program Director</p>
              </div>
            </div>

            <div className="flex flex-col items-center mx-8">
              <div className="mb-4">
                {instituteInfo.seal}
              </div>
              <p className="text-xs text-gray-500 font-medium">Official Seal</p>
            </div>

            <div className="text-center flex-1">
              <div className="h-16 w-52 mx-auto mb-4">
                {instituteInfo.signature}
              </div>
              <div className="border-t-2 border-blue-600 pt-2 mx-auto w-48">
                <p className="text-sm font-bold text-blue-900">Mark Thompson</p>
                <p className="text-xs text-gray-600 font-semibold">Registrar</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-semibold mb-2">
                {instituteInfo.name} - {instituteInfo.address}
              </p>
              <p className="text-sm text-blue-600 mb-2">
                Website: {instituteInfo.website}
              </p>
              <p className="text-xs text-gray-600">
                🔒 Verify this certificate at {instituteInfo.website}/verify
              </p>
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
              padding: 0; 
              margin: 0; 
              max-width: none;
            }
            @page { 
              size: A4 portrait; 
              margin: 0.5cm; 
            }
            .shadow-2xl,
            .shadow-xl,
            .shadow-lg {
              box-shadow: none !important;
            }
          }
        `,
        }}
      />
    </div>
  );
};

export default CertificateDetails;
