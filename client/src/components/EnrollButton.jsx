import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EnrollButton = ({ courseId }) => {
  const navigate = useNavigate();

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the authentication token from local storage

      if (!token) {
        alert("Please log in to enroll in this course.");
        navigate("/login"); // Redirect to login if token is missing
        return;
      }

      const response = await axios.post(
        `https://sky-wings-server.vercel.app/course/${courseId}/enroll`,
        {}, // Empty body, as the server expects data in headers
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        }
      );
      window.location.href = response.data.url; // Redirect to Stripe checkout
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message); // Show error message from server
        if (error.response.status === 401 || error.response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } else {
        alert("An error occurred while enrolling.");
      }
    }
  };

  return (
    <button
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      onClick={handleEnroll}
    >
      Enroll Now
    </button>
  );
};

export default EnrollButton;
