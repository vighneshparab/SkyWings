import React, { useEffect, useState } from "react";
import axios from "axios";

const ReportList = () => {
  const [report, setReport] = useState(null);

  // Fetch report data
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          "https://sky-wings-server.vercel.app/api/admin/reports",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReport(response.data);
      } catch (error) {
        console.error("Failed to fetch report:", error);
      }
    };
    fetchReport();
  }, []);

  if (!report) {
    return <p className="text-center text-gray-600">Loading report...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Reports</h1>

      {/* Total Revenue */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Total Revenue
        </h2>
        <p className="text-2xl font-bold text-green-600">
          ${report.totalRevenue.toFixed(2)}
        </p>
      </div>

      {/* Total Enrollments */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Total Enrollments
        </h2>
        <p className="text-2xl font-bold text-blue-600">
          {report.totalEnrollments}
        </p>
      </div>

      {/* Course-wise Revenue */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Course-wise Revenue
        </h2>
        <ul className="space-y-3">
          {Object.entries(report.courseRevenue).map(([course, revenue]) => (
            <li key={course} className="flex justify-between items-center">
              <span className="text-gray-700">{course}</span>
              <span className="text-lg font-semibold text-green-600">
                ${revenue.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Status Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Payment Status Distribution
        </h2>
        <ul className="space-y-3">
          <li className="flex justify-between items-center">
            <span className="text-gray-700">Pending</span>
            <span className="text-lg font-semibold text-yellow-600">
              {report.paymentStatusDistribution.pending}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-gray-700">Completed</span>
            <span className="text-lg font-semibold text-green-600">
              {report.paymentStatusDistribution.completed}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-gray-700">Failed</span>
            <span className="text-lg font-semibold text-red-600">
              {report.paymentStatusDistribution.failed}
            </span>
          </li>
        </ul>
      </div>

      {/* User-wise Payments */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          User-wise Payments
        </h2>
        <ul className="space-y-3">
          {Object.entries(report.userPayments).map(([user, data]) => (
            <li key={user} className="flex justify-between items-center">
              <span className="text-gray-700">{user}</span>
              <span className="text-lg font-semibold text-blue-600">
                {data.totalPayments} payments (Total: $
                {data.totalAmount.toFixed(2)})
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Total Discounts */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Total Discounts Applied
        </h2>
        <p className="text-2xl font-bold text-purple-600">
          {report.totalDiscounts}
        </p>
      </div>
    </div>
  );
};

export default ReportList;
