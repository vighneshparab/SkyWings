import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaBars, FaTimes, FaPlane } from "react-icons/fa";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-2xl font-extrabold tracking-wide"
            >
              <FaPlane className="h-8 w-8 mr-2 text-yellow-300 animate-bounce" />
              SkyWings
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="hover:text-yellow-300 transition-all duration-300"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-yellow-300 transition-all duration-300"
            >
              About
            </Link>
            <Link
              to="/courses"
              className="hover:text-yellow-300 transition-all duration-300"
            >
              Courses
            </Link>
            <Link
              to="/contact"
              className="hover:text-yellow-300 transition-all duration-300"
            >
              Contact
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="hover:text-yellow-300 flex items-center transition-all duration-300"
                >
                  <FaUser className="mr-1" /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-yellow-300 text-purple-800 rounded-md hover:bg-yellow-400 flex items-center transition-all duration-300 shadow-lg"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-yellow-300 text-purple-800 rounded-md hover:bg-yellow-400 flex items-center transition-all duration-300 shadow-lg"
              >
                <FaUser className="mr-2" /> Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-white hover:text-yellow-300 transition-all duration-300"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-600 px-4 pt-2 pb-3 space-y-2 text-center transition-all duration-300">
          <Link
            to="/"
            className="block py-2 hover:text-yellow-300 transition-all duration-300"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block py-2 hover:text-yellow-300 transition-all duration-300"
          >
            About
          </Link>
          <Link
            to="/courses"
            className="block py-2 hover:text-yellow-300 transition-all duration-300"
          >
            Courses
          </Link>
          <Link
            to="/contact"
            className="block py-2 hover:text-yellow-300 transition-all duration-300"
          >
            Contact
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="block py-2 hover:text-yellow-300 flex justify-center transition-all duration-300"
              >
                <FaUser className="mr-2" /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-yellow-300 text-purple-800 rounded-md hover:bg-yellow-400 flex justify-center transition-all duration-300 shadow-lg"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block py-2 bg-yellow-300 text-purple-800 rounded-md hover:bg-yellow-400 flex justify-center transition-all duration-300 shadow-lg"
            >
              <FaUser className="mr-2" /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
