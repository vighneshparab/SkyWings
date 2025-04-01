import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "./Student/Profile";
import EnrolledCourse from "./Student/EnrolledCourse";
import Certificates from "./Student/Certificates";
import FeedBack from "./Student/Feedback";
import ResourceLibrary from "./Student/Resourse";
import Lectures from "./Student/Lectures";
import Exams from "./Student/Exam"; // Import the new Exams component
import axios from "axios";

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("profile");
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/course/enrolled",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };
    fetchEnrolledCourses();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const goToHomePage = () => {
    navigate("/"); // Navigate to the home page
  };

  const renderSection = () => {
    switch (activeLink) {
      case "profile":
        return <Profile />;
      case "courses":
        return <EnrolledCourse />;
      case "certificates":
        return <Certificates />;
      case "feedback":
        return <FeedBack />;
      case "lectures":
        return <Lectures />;
      case "exams":
        return <Exams />; // New exams section
      case "resources":
        return courses.length > 0 ? (
          courses.map((course) => (
            <ResourceLibrary
              key={course.course._id}
              courseId={course.course._id}
            />
          ))
        ) : (
          <p>No enrolled courses found.</p>
        );
      default:
        return <Profile />;
    }
  };

  const sidebarLinks = [
    {
      id: "home",
      label: "Home",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      id: "profile",
      label: "Profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      id: "courses",
      label: "Enrolled Courses",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    },
    {
      id: "lectures",
      label: "Lectures",
      icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    },
    {
      id: "exams", // New exams link
      label: "My Exams",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
      id: "certificates",
      label: "Certificates",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      id: "feedback",
      label: "Feedback & Reviews",
      icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
    },
    {
      id: "resources",
      label: "Resource Library",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    },
    {
      id: "logout",
      label: "Logout",
      icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Hamburger Menu */}
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">SkyWings - Student Dashboard</h1>
          <button
            onClick={toggleSidebar}
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

      {/* Sidebar/Navbar for Mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
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
                      : link.id === "home"
                      ? goToHomePage()
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
                        : link.id === "home"
                        ? goToHomePage()
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

export default StudentDashboard;
