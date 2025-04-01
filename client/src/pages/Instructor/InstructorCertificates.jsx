import React, { useState, useEffect } from "react";
import axios from "axios";

function InstructorCertificates() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourses();
    fetchCertificates();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "https://sky-wings-server.vercel.app/instructor/courses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses(response.data);
    } catch (err) {
      setError("Failed to fetch courses");
      console.error(err);
    }
  };

  const fetchStudents = async (courseId) => {
    setSelectedCourse(courseId);
    try {
      const response = await axios.get(
        `https://sky-wings-server.vercel.app/instructor/students/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(response.data);
    } catch (err) {
      setError("Failed to fetch students");
      console.error(err);
    }
  };

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://sky-wings-server.vercel.app/instructor/certificates",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCertificates(response.data);
    } catch (err) {
      setError("Failed to fetch certificates");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCertificate = async () => {
    if (!selectedCourse || !selectedStudent) {
      alert("Please select a course and student.");
      return;
    }

    try {
      const response = await axios.post(
        "https://sky-wings-server.vercel.app/instructor/certificates",
        {
          student: selectedStudent,
          course: selectedCourse,
          certificateType: "completion",
          validityPeriod: "12 months",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Certificate issued successfully!");
      setCertificates([...certificates, response.data.certificate]);
    } catch (err) {
      if (err.response) {
        // Handle specific error messages from the backend
        alert(err.response.data.message || "Failed to issue certificate");
      } else {
        alert("Failed to issue certificate");
      }
      console.error(err);
    }
  };

  const handleDeleteCertificate = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this certificate?")) {
      return;
    }

    try {
      await axios.delete(
        `https://sky-wings-server.vercel.app/instructor/certificates/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Certificate revoked successfully");
      setCertificates(certificates.filter((cert) => cert._id !== id));
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || "Failed to revoke certificate");
      } else {
        alert("Failed to revoke certificate");
      }
      console.error(err);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container p-4">
      <h2 className="text-xl font-bold mb-4">Manage Certificates</h2>

      {/* Course Selection */}
      <div className="mb-4">
        <label className="block mb-2">Select Course:</label>
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => fetchStudents(e.target.value)}
          value={selectedCourse}
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Student Selection */}
      {selectedCourse && (
        <div className="mb-4">
          <label className="block mb-2">Select Student:</label>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => setSelectedStudent(e.target.value)}
            value={selectedStudent}
          >
            <option value="">-- Select Student --</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} ({student.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Issue Certificate Button */}
      <button
        onClick={handleIssueCertificate}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Issue Certificate
      </button>

      {/* Issued Certificates List */}
      <h3 className="text-lg font-bold mb-2">Issued Certificates</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Student</th>
              <th className="px-4 py-2 border">Course</th>
              <th className="px-4 py-2 border">Certificate ID</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Validity</th>
              <th className="px-4 py-2 border">Issue Date</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert._id} className="text-center">
                <td className="px-4 py-2 border">
                  {cert.student.name} ({cert.student.email})
                </td>
                <td className="px-4 py-2 border">{cert.course.title}</td>
                <td className="px-4 py-2 border">{cert.certificateId}</td>
                <td className="px-4 py-2 border">{cert.certificateType}</td>
                <td className="px-4 py-2 border">{cert.validityPeriod}</td>
                <td className="px-4 py-2 border">
                  {new Date(cert.issueDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InstructorCertificates;
