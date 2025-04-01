import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-2 text-yellow-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 3.636a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 01-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0zm9.9 0a1 1 0 011.414 0 9 9 0 010 12.728 1 1 0 01-1.414-1.414 7 7 0 000-9.9 1 1 0 010-1.414zM7.879 6.464a1 1 0 010 1.414 3 3 0 000 4.243 1 1 0 01-1.414 1.414 5 5 0 010-7.07 1 1 0 011.414 0zm4.242 0a1 1 0 011.414 0 5 5 0 010 7.072 1 1 0 01-1.414-1.414 3 3 0 000-4.242 1 1 0 010-1.415z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-bold text-xl">SkyWings</span>
            </div>
            <p className="mt-4 text-gray-200">
              Empowering future aviation professionals through quality education
              and training since 2005.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-200 hover:text-yellow-300 transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-200 hover:text-yellow-300 transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-gray-200 hover:text-yellow-300 transition-colors duration-300"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-200 hover:text-yellow-300 transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-200">
              <li className="flex items-center">
                <FaMapMarkerAlt className="h-5 w-5 mr-2 text-yellow-300" />
                123 Sky Avenue, Airline City
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="h-5 w-5 mr-2 text-yellow-300" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center">
                <FaEnvelope className="h-5 w-5 mr-2 text-yellow-300" />
                info@skywings.edu
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-200 hover:text-yellow-300 transition-colors duration-300"
              >
                <FaFacebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-yellow-300 transition-colors duration-300"
              >
                <FaInstagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-yellow-300 transition-colors duration-300"
              >
                <FaTwitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-yellow-300 transition-colors duration-300"
              >
                <FaYoutube className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-600 text-center text-gray-200">
          <p>
            &copy; {new Date().getFullYear()} SkyWings Air Hostess Institute.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
