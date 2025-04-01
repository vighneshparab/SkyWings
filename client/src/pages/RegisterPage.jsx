import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/images/plane.png"; // Import your registration background image

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    languageProficiency: "",
    image: null, // Add image state
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const validateForm = () => {
    const {
      name,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      nationality,
      languageProficiency,
      image,
    } = formData;

    // Required Fields
    if (
      !name ||
      !email ||
      !password ||
      !gender ||
      !nationality ||
      !languageProficiency
    ) {
      setError("All required fields must be filled.");
      return false;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    // Password Validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    // Phone Validation (Optional)
    if (phone && !/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }

    // Date of Birth Validation
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      setError("You must be at least 18 years old to register.");
      return false;
    }

    // Image Validation
    if (image) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(image.type)) {
        setError("Only JPEG, PNG, or GIF images are allowed.");
        return false;
      }
      if (image.size > 2 * 1024 * 1024) {
        // 2MB limit
        setError("Image size must be less than 2MB.");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Registration successful:", response.data);
      setSuccessMessage("Registration successful. Redirecting to login...");

      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-60"></div>
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            Register
          </h2>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {successMessage && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
              role="alert"
            >
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          {loading && <div className="text-center mb-6">Loading...</div>}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Name */}
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Address */}
            <div className="mb-4 md:col-span-2">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <label className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Nationality */}
            <div className="mb-4">
              <label className="block text-gray-700">Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Language Proficiency */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Language Proficiency
              </label>
              <input
                type="text"
                name="languageProficiency"
                value={formData.languageProficiency}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-gray-700">Profile Image</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept="image/*"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 md:col-span-2"
            >
              Register
            </button>
          </form>

          <p className="mt-4 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
