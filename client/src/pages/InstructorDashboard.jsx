import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Components for Instructor Dashboard
import InstructorCourses from "./Instructor/InstructorCourses";
import InstructorAttendance from "./Instructor/InstructorAttendance";
import InstructorExams from "./Instructor/InstructorExams";
import InstructorCertificates from "./Instructor/InstructorCertificates";
import InstructorSessions from "./Instructor/InstructorSessions";
import InstructorResources from "./Instructor/InstructorResources"; // New component

const InstructorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("courses"); // Default to "courses"
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [exams, setExams] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [resources, setResources] = useState([]); // New state for resources
  const navigate = useNavigate();

  // Fetch all courses taught by the instructor
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "https://sky-wings-server.vercel.app/api/instructor/courses",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // Fetch all sessions for a course
  const fetchSessions = async (courseId) => {
    try {
      const response = await axios.get(
        `https://sky-wings-server.vercel.app/api/instructor/courses/${courseId}/sessions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  // Fetch attendance for a session
  const fetchAttendance = async (sessionId) => {
    try {
      const response = await axios.get(
        `https://sky-wings-server.vercel.app/api/instructor/sessions/${sessionId}/attendance`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAttendance(response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  // Fetch all exams for a course
  const fetchExams = async (courseId) => {
    try {
      const response = await axios.get(
        `https://sky-wings-server.vercel.app/api/instructor/courses/${courseId}/exams`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  // Fetch all issued certificates
  const fetchCertificates = async () => {
    try {
      const response = await axios.get(
        "https://sky-wings-server.vercel.app/api/instructor/certificates",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCertificates(response.data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  // Fetch all resources for a course
  const fetchResources = async (courseId) => {
    try {
      const response = await axios.get(
        `https://sky-wings-server.vercel.app/api/instructor/courses/${courseId}/resources`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setResources(response.data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Handle link clicks
  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsSidebarOpen(false); // Close sidebar on mobile after clicking a link
  };

  // Render the active section
  const renderSection = () => {
    switch (activeLink) {
      case "courses":
        return (
          <InstructorCourses
            courses={courses}
            fetchSessions={fetchSessions}
            fetchResources={fetchResources}
          />
        );
      case "sessions":
        return (
          <InstructorSessions
            sessions={sessions}
            fetchAttendance={fetchAttendance}
          />
        );
      case "attendance":
        return <InstructorAttendance attendance={attendance} />;
      case "exams":
        return <InstructorExams exams={exams} />;
      case "certificates":
        return <InstructorCertificates certificates={certificates} />;
      case "resources":
        return <InstructorResources resources={resources} />;
      default:
        return (
          <InstructorCourses
            courses={courses}
            fetchSessions={fetchSessions}
            fetchResources={fetchResources}
          />
        );
    }
  };

  // Sidebar links for Instructor Dashboard
  const sidebarLinks = [
    {
      id: "courses",
      label: "Courses",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    },
    {
      id: "sessions",
      label: "Sessions",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      id: "exams",
      label: "Exams",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    },
    {
      id: "certificates",
      label: "Certificates",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      id: "resources",
      label: "Resources",
      icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    },
    {
      id: "logout",
      label: "Logout",
      icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            SkyWings - Instructor Dashboard
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </header>

      {/* Sidebar for Mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Navigation</h2>
          <ul className="space-y-2">
            {sidebarLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`flex items-center p-2 rounded-lg ${
                    activeLink === link.id
                      ? link.id === "logout"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    link.id === "logout"
                      ? handleLogout()
                      : handleLinkClick(link.id)
                  }
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={link.icon}
                    ></path>
                  </svg>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar for Desktop */}
          <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Navigation</h2>
            <ul className="space-y-2">
              {sidebarLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={`flex items-center p-2 rounded-lg ${
                      activeLink === link.id
                        ? link.id === "logout"
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      link.id === "logout"
                        ? handleLogout()
                        : handleLinkClick(link.id)
                    }
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={link.icon}
                      ></path>
                    </svg>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-8">{renderSection()}</main>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
