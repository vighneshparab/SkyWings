import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";

const InstructorSessions = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sessionForm, setSessionForm] = useState({
    sessionDate: "",
    sessionTime: "",
    sessionType: "live",
    sessionDuration: 60,
    title: "",
    description: "",
    googleMeetLink: "",
    recordingLink: "",
  });

  const authToken = localStorage.getItem("token");
  const API_BASE_URL = "https://sky-wings-server.vercel.app/api/instructor/";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}courses`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCourses(res.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async (courseId) => {
    if (!courseId) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}sessions/${courseId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSessions(res.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Combine date and time
      const sessionDateTime = `${sessionForm.sessionDate}T${sessionForm.sessionTime}`;

      const payload = {
        courseId: selectedCourse,
        ...sessionForm,
        sessionDate: sessionDateTime,
        // Only include the appropriate link based on session type
        googleMeetLink:
          sessionForm.sessionType === "live"
            ? sessionForm.googleMeetLink
            : undefined,
        recordingLink:
          sessionForm.sessionType === "recorded"
            ? sessionForm.recordingLink
            : undefined,
      };

      await axios.post(`${API_BASE_URL}sessions`, payload, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setSessionForm({
        sessionDate: "",
        sessionTime: "",
        sessionType: "live",
        sessionDuration: 60,
        title: "",
        description: "",
        googleMeetLink: "",
        recordingLink: "",
      });

      fetchSessions(selectedCourse);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionTypeChange = (e) => {
    const newType = e.target.value;
    setSessionForm({
      ...sessionForm,
      sessionType: newType,
      // Clear the opposite link when switching types
      googleMeetLink: newType === "live" ? sessionForm.googleMeetLink : "",
      recordingLink: newType === "recorded" ? sessionForm.recordingLink : "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-center text-2xl font-bold text-blue-600 mb-6">
        Instructor Dashboard
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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
          disabled={loading}
        >
          <option value="">Choose a course...</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title} ({course.code})
            </option>
          ))}
        </select>
      </div>

      {/* Create Session Form */}
      {selectedCourse && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h4 className="text-xl font-semibold text-green-600 mb-4">
            Create New Session
          </h4>
          <form onSubmit={handleSessionCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  value={sessionForm.sessionDate}
                  onChange={(e) =>
                    setSessionForm({
                      ...sessionForm,
                      sessionDate: e.target.value,
                    })
                  }
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md"
                  value={sessionForm.sessionTime}
                  onChange={(e) =>
                    setSessionForm({
                      ...sessionForm,
                      sessionTime: e.target.value,
                    })
                  }
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-1">Session Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={sessionForm.sessionType}
                  onChange={handleSessionTypeChange}
                  disabled={loading}
                >
                  <option value="live">Live Session</option>
                  <option value="recorded">Recorded Session</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={sessionForm.sessionDuration}
                  onChange={(e) =>
                    setSessionForm({
                      ...sessionForm,
                      sessionDuration: e.target.value,
                    })
                  }
                  min="1"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Session title"
                value={sessionForm.title}
                onChange={(e) =>
                  setSessionForm({ ...sessionForm, title: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded-md"
                placeholder="Session description"
                rows="3"
                value={sessionForm.description}
                onChange={(e) =>
                  setSessionForm({
                    ...sessionForm,
                    description: e.target.value,
                  })
                }
                disabled={loading}
              ></textarea>
            </div>

            {sessionForm.sessionType === "live" && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">
                  Google Meet Link
                </label>
                <input
                  type="url"
                  className="w-full p-2 border rounded-md"
                  placeholder="https://meet.google.com/abc-xyz-123"
                  value={sessionForm.googleMeetLink}
                  onChange={(e) =>
                    setSessionForm({
                      ...sessionForm,
                      googleMeetLink: e.target.value,
                    })
                  }
                  required={sessionForm.sessionType === "live"}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be a valid Google Meet URL
                </p>
              </div>
            )}

            {sessionForm.sessionType === "recorded" && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">
                  Recording Link (optional)
                </label>
                <input
                  type="url"
                  className="w-full p-2 border rounded-md"
                  placeholder="https://drive.google.com/recording123"
                  value={sessionForm.recordingLink}
                  onChange={(e) =>
                    setSessionForm({
                      ...sessionForm,
                      recordingLink: e.target.value,
                    })
                  }
                  disabled={loading}
                />
              </div>
            )}

            <button
              className={`w-full p-2 rounded-md text-white ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Session"}
            </button>
          </form>
        </div>
      )}

      {/* Sessions List */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold text-blue-600">Sessions</h4>
          {selectedCourse && (
            <button
              onClick={() => fetchSessions(selectedCourse)}
              className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
              disabled={loading}
            >
              Refresh
            </button>
          )}
        </div>

        {loading && sessions.length === 0 ? (
          <div className="text-center py-8">Loading sessions...</div>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {session.title}
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          session.sessionType === "live"
                            ? "bg-red-100 text-red-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {session.sessionType.toUpperCase()}
                      </span>
                    </h3>
                    <p className="text-gray-600">
                      {format(parseISO(session.sessionDate), "PPPPp")} •{" "}
                      {session.sessionDuration} mins
                    </p>
                    {session.description && (
                      <p className="mt-1 text-gray-700">
                        {session.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    {session.sessionType === "live" &&
                      session.googleMeetLink && (
                        <a
                          href={session.googleMeetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Join Meeting
                        </a>
                      )}
                    {session.sessionType === "recorded" &&
                      session.recordingLink && (
                        <a
                          href={session.recordingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Recording
                        </a>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            {selectedCourse
              ? "No sessions found for this course"
              : "Select a course to view sessions"}
          </p>
        )}
      </div>
    </div>
  );
};

export default InstructorSessions;
