import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);

  // Fetch all payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          "https://sky-wings-server.vercel.app/api/admin/payments",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPayments(response.data);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payment Management</h1>

      {/* Payment List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Enrollment</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Currency</th>
              <th className="px-4 py-2 border">Payment Method</th>
              <th className="px-4 py-2 border">Payment Date</th>
              <th className="px-4 py-2 border">Transaction ID</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Discount Code</th>
              <th className="px-4 py-2 border">Payment Plan</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="text-center">
                <td className="px-4 py-2 border">
                  {payment.user?.name} ({payment.user?.email})
                </td>
                <td className="px-4 py-2 border">
                  {payment.enrollment?.course} ({payment.enrollment?.status})
                </td>
                <td className="px-4 py-2 border">{payment.amount}</td>
                <td className="px-4 py-2 border">{payment.currency}</td>
                <td className="px-4 py-2 border">{payment.paymentMethod}</td>
                <td className="px-4 py-2 border">
                  {new Date(payment.paymentDate).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">{payment.transactionId}</td>
                <td className="px-4 py-2 border">{payment.status}</td>
                <td className="px-4 py-2 border">
                  {payment.discountCode || "N/A"}
                </td>
                <td className="px-4 py-2 border">{payment.paymentPlan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentList;
