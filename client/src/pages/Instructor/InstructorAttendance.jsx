import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const InstructorAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attendanceForm, setAttendanceForm] = useState({
    sessionId: "",
    studentId: "",
    status: "present",
  });
  const [filter, setFilter] = useState("all"); // Filter for attendance

  const authToken = localStorage.getItem("token");
  const API_BASE_URL = "https://sky-wings-server.vercel.app/api/instructor/";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}courses`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchSessions = async (courseId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}sessions/${courseId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSessions(res.data);
      fetchStudents(courseId);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const fetchStudents = async (courseId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}students/${courseId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchAttendance = async (sessionId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}attendance/${sessionId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setAttendance(res.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}attendance`,
        { ...attendanceForm },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      alert("Attendance marked successfully");
      setAttendanceForm({ sessionId: "", studentId: "", status: "present" });
      fetchAttendance(attendanceForm.sessionId); // Refresh attendance data
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to mark attendance");
    }
  };

  const handleDownloadExcel = () => {
    const filteredData = attendance
      .filter((att) => filter === "all" || att.status === filter)
      .map((att) => ({
        Student: att.student.name,
        Email: att.student.email,
        Status: att.status.charAt(0).toUpperCase() + att.status.slice(1),
      }));

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, "attendance.xlsx");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-center text-2xl font-bold text-blue-600 mb-6">
        Instructor Dashboard
      </h2>

      {/* Course Selection */}
      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <label className="font-semibold text-gray-700">Select Course:</label>
        <select
          className="w-full mt-2 p-2 border rounded-md"
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            fetchSessions(e.target.value);
          }}
        >
          <option value="">Choose...</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Attendance Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h4 className="text-xl font-semibold text-red-600 mb-4">
          Mark Attendance
        </h4>
        <form onSubmit={handleMarkAttendance}>
          <select
            className="w-full p-2 mb-3 border rounded-md"
            value={attendanceForm.sessionId}
            onChange={(e) => {
              setAttendanceForm({
                ...attendanceForm,
                sessionId: e.target.value,
              });
              fetchAttendance(e.target.value);
            }}
            required
          >
            <option value="">Select Session</option>
            {sessions.map((session) => (
              <option key={session._id} value={session._id}>
                {session.title}
              </option>
            ))}
          </select>

          <select
            className="w-full p-2 mb-3 border rounded-md"
            value={attendanceForm.studentId}
            onChange={(e) =>
              setAttendanceForm({
                ...attendanceForm,
                studentId: e.target.value,
              })
            }
            required
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name}
              </option>
            ))}
          </select>

          <select
            className="w-full p-2 mb-3 border rounded-md"
            value={attendanceForm.status}
            onChange={(e) =>
              setAttendanceForm({ ...attendanceForm, status: e.target.value })
            }
            required
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>

          <button
            type="submit"
            className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
          >
            Mark Attendance
          </button>
        </form>
      </div>

      {/* Attendance Filter & Download */}
      {attendance.length > 0 && (
        <div className="bg-white p-6 mt-6 rounded-lg shadow-lg">
          <h4 className="text-xl font-semibold text-blue-600 mb-4">
            Attendance Records
          </h4>

          <label className="font-semibold text-gray-700">
            Filter by Status:
          </label>
          <select
            className="w-full p-2 mb-3 border rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>

          <button
            onClick={handleDownloadExcel}
            className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
          >
            Download Attendance (Excel)
          </button>

          <ul className="mt-4">
            {attendance
              .filter((att) => filter === "all" || att.status === filter)
              .map((att) => (
                <li key={att._id} className="p-2 border-b">
                  {att.student.name} -{" "}
                  {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InstructorAttendance;
