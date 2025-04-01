import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import LandingPage from "../pages/LandingPage";
import NotFoundPage from "../pages/NotFoundPage";
import CourseDetails from "../pages/CourseDetails";
import Courses from "../pages/Courses";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import StudentDashboard from "../pages/StudentDashboard";
import About from "../pages/About";
import Contact from "../pages/Contact";
import InstructorDashboard from "../pages/InstructorDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import CertificateDetails from "../pages/Student/CertificatesDetails";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/course/:id" element={<CourseDetails />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />

      <Route
        path="dashboard" // Use :id as a route parameter
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/certificate/:certificateId" // Use :id as a route parameter
        element={
          <ProtectedRoute>
            <CertificateDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/dashboard" // Use :id as a route parameter
        element={
          <ProtectedRoute>
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard" // Use :id as a route parameter
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
