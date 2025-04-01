import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";

const MySessions = () => {
  const [sessions, setSessions] = useState({
    upcoming: [],
    past: [],
    stats: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentSessions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/student/my-sessions",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSessions(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load your sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentSessions();
  }, []);

  if (loading)
    return <div className="text-center py-8">Loading your sessions...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">My Learning Sessions</h2>

      {/* Session Stats */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-100 flex justify-between">
        <p className="font-medium">
          Total Sessions:{" "}
          <span className="font-bold">{sessions.stats.total || 0}</span>
        </p>
        <p className="font-medium">
          Upcoming:{" "}
          <span className="text-blue-600 font-bold">
            {sessions.stats.upcoming || 0}
          </span>
        </p>
        <p className="font-medium">
          Completed:{" "}
          <span className="text-green-600 font-bold">
            {sessions.stats.completed || 0}
          </span>
        </p>
      </div>

      {/* Upcoming Sessions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-700">
          Upcoming Sessions
        </h3>
        {sessions.upcoming.length === 0 ? (
          <p className="text-gray-500">No upcoming sessions.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.upcoming.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                type="upcoming"
              />
            ))}
          </div>
        )}
      </div>

      {/* Past Sessions */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-green-700">
          Completed Sessions
        </h3>
        {sessions.past.length === 0 ? (
          <p className="text-gray-500">No completed sessions yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.past.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                type="completed"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Session Card Component
const SessionCard = ({ session, type }) => {
  return (
    <div className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg text-blue-700">
            {session.title}
          </h3>
          <Link
            to={`/courses/${session.course?._id}`}
            className="text-sm text-gray-600 hover:underline"
          >
            {session.course?.title} ({session.course?.code})
          </Link>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            session.sessionType === "live"
              ? "bg-red-100 text-red-800"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          {session.sessionType.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <p className="font-medium text-gray-700">Date & Time</p>
          <p className="text-gray-600">
            {format(parseISO(session.sessionDate), "PPpp")}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-700">Duration</p>
          <p className="text-gray-600">{session.duration} mins</p>
        </div>
        <div>
          <p className="font-medium text-gray-700">Instructor</p>
          <p className="text-gray-600">{session.instructor?.name}</p>
        </div>
        <div>
          <p className="font-medium text-gray-700">Course Category</p>
          <p className="text-gray-600">{session.course?.category}</p>
        </div>
      </div>

      {session.description && (
        <div className="mt-2">
          <p className="font-medium text-gray-700">Description</p>
          <p className="text-gray-600">{session.description}</p>
        </div>
      )}

      {/* Session Links */}
      {type === "upcoming" && session.joinLink && (
        <a
          href={session.joinLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-3 text-blue-600 hover:underline font-medium"
        >
          Join Live Session
        </a>
      )}
      {type === "completed" && session.recordingLink && (
        <a
          href={session.recordingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-3 text-purple-600 hover:underline font-medium"
        >
          Watch Recording
        </a>
      )}
    </div>
  );
};

export default MySessions;
