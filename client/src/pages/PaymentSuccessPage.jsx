import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const invoiceRef = useRef();

  useEffect(() => {
    if (sessionId) {
      const handlePaymentSuccess = async () => {
        try {
          const token = localStorage.getItem("token");

          if (!token) {
            setError("Authentication token missing.");
            setLoading(false);
            return;
          }

          const response = await axios.post(
            "https://sky-wings-server.vercel.app/course/payment-success",
            { session_id: sessionId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setInvoiceData(response.data.invoiceData);
          setLoading(false);
        } catch (err) {
          setError(
            err.response?.data?.message || "Payment verification failed."
          );
          setLoading(false);
          if (
            err.response &&
            (err.response.status === 401 || err.response.status === 403)
          ) {
            localStorage.removeItem("token");
            navigate("/login");
          }
        }
      };
      handlePaymentSuccess();
    } else {
      setError("Session ID not found.");
      setLoading(false);
    }
  }, [sessionId, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const messageVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, delay: 0.2 },
    },
  };

  const downloadInvoice = () => {
    const input = invoiceRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0, width, height);
      pdf.save("invoice.pdf");
    });
  };

  if (loading) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex justify-center items-center h-screen"
      >
        <p className="text-center text-gray-600">Verifying payment...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex justify-center items-center h-screen"
      >
        <motion.div variants={messageVariants} className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Go to Home
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex justify-center items-center min-h-screen p-4"
    >
      <motion.div variants={messageVariants} className="max-w-2xl w-full">
        <div ref={invoiceRef} className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
              <p className="text-sm text-gray-600">
                Invoice #: {invoiceData?.invoiceId}
              </p>
            </div>
            <div>
              <p className="text-right text-gray-600">
                Date: {invoiceData?.date}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Billed To
            </h2>
            <p className="text-gray-700">{invoiceData?.student.name}</p>
            <p className="text-gray-700">{invoiceData?.student.email}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Course Details
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Course Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {invoiceData?.course.name}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      ₹{invoiceData?.course.price}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Payment Details
            </h2>
            <p className="text-gray-700 transaction-id">
              Transaction ID: {invoiceData?.payment.transactionId}
            </p>
            <p className="text-gray-700">
              Amount: ₹{invoiceData?.payment.amount}
            </p>
            <p className="text-gray-700">
              Status: {invoiceData?.payment.status}
            </p>
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            onClick={downloadInvoice}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
          >
            Download PDF
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Go to Dashboard
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentSuccessPage;
