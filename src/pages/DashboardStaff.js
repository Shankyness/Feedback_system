import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [staffInfo, setStaffInfo] = useState({ name: "", email: "" });
  const [feedbackStats, setFeedbackStats] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
    total: 0,
  });
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem("access_token");

  // Fetch staff info and feedback stats
  useEffect(() => {
    const fetchStaffInfoAndStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/feedback/dashboard/staff/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        // Update staff info
        setStaffInfo(response.data.staff_info);

        // Update feedback stats from response
        const sentimentCounts = response.data.sentiment_counts || {};
        setFeedbackStats({
          positive: sentimentCounts.positive_count || 0,
          neutral: sentimentCounts.neutral_count || 0,
          negative: sentimentCounts.negative_count || 0,
          total: sentimentCounts.total_count || 0,
        });
      } catch (err) {
        setError("Failed to fetch staff info and stats.");
      }
    };
    fetchStaffInfoAndStats();
  }, [authToken]);

  return (
    <div className="p-8 bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg p-6 rounded-lg w-full max-w-2xl mb-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Welcome, {staffInfo.name || "Staff Member"}
        </h1>
        <p className="text-center text-gray-600">
          Email-ID: {staffInfo.email || "Not Available"}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Feedback History */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg p-6 rounded-lg flex flex-col items-center"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
            Feedback History
          </h2>
          <button
            onClick={() => navigate("/staff-feedback-table")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            View All Feedbacks
          </button>
        </motion.div>

        {/* Feedback Summary */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg p-6 rounded-lg"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Feedback Summary
          </h2>
          <ul className="space-y-2">
            <li className="text-gray-700">
              Positive: {feedbackStats.positive}
            </li>
            <li className="text-gray-700">Neutral: {feedbackStats.neutral}</li>
            <li className="text-gray-700">
              Negative: {feedbackStats.negative}
            </li>
            <li className="text-gray-700">Total: {feedbackStats.total}</li>
          </ul>
        </motion.div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-red-100 text-red-700 p-4 rounded mt-6"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default StaffDashboard;
