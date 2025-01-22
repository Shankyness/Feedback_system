import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState({ name: "", email: "" });
  const [feedbackStats, setFeedbackStats] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
    total_count: 0,
    feedbacks_last_day: 0,
    feedbacks_last_week: 0,
    feedbacks_last_month: 0,
    active_users_count: 0,
  });
  const [timeFilter, setTimeFilter] = useState("total");
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/feedback/dashboard/admin/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setAdminInfo(response.data.admin_info);
      } catch (error) {
        setError("Failed to fetch admin info.");
      }
    };
    fetchAdminInfo();
  }, [authToken]);

  useEffect(() => {
    const fetchFeedbackStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/feedback/analysis/",
          {
            params: { filter: timeFilter },
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setFeedbackStats(response.data);
      } catch (error) {
        setError("Failed to fetch feedback statistics.");
      }
    };
    fetchFeedbackStats();
  }, [timeFilter, authToken]);

  const pieData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        data: [
          feedbackStats.positive,
          feedbackStats.negative,
          feedbackStats.neutral,
        ],
        backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        label: "Feedback Count",
        data: [
          feedbackStats.positive,
          feedbackStats.negative,
          feedbackStats.neutral,
        ],
        backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  const barOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };

  return (
    <div className="p-8 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen">
      <div className="bg-white shadow p-4 rounded-lg mb-6 text-center">
        <h2 className="text-xl font-bold">
          Welcome, {adminInfo.name || "Admin"}
        </h2>
        <p>Email: {adminInfo.email || "admin@example.com"}</p>
        <p>Date: {formatDate(new Date())}</p>
      </div>

      <div className="flex flex-row gap-6 mb-6 justify-center items-center">
        <div className="bg-white shadow p-4 rounded-lg w-1/3 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold">Total Feedbacks</h3>
          <p className="text-2xl font-semibold">{feedbackStats.total_count}</p>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/admin-feedback")}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transform hover:scale-105 transition-transform"
            >
              View Feedbacks
            </button>
          </div>
        </div>
        <div className="bg-white shadow p-4 rounded-lg w-1/3 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold">Recent Feedbacks</h3>
          <div className="flex flex-col gap-2 mt-2">
            <p>Today: {feedbackStats.feedbacks_last_day}</p>
            <p>This Week: {feedbackStats.feedbacks_last_week}</p>
            <p>This Month: {feedbackStats.feedbacks_last_month}</p>
          </div>
        </div>
        <div className="bg-white shadow p-4 rounded-lg w-1/3 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold">Total Active Users</h3>
          <p className="text-2xl font-semibold">
            {feedbackStats.active_users_count}
          </p>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/admin-users")}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transform hover:scale-105 transition-transform"
            >
              View Users
              <FaArrowRight className="inline-block ml-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow p-6 rounded-lg mb-8 flex gap-6">
        <div className="w-1/2 relative" style={{ height: "300px" }}>
          <Pie data={pieData} options={pieOptions} />
          <div className="absolute top-2 right-2">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg"
            >
              <option value="total">Total Feedback</option>
              <option value="last7days">This Week</option>
              <option value="lastmonth">This Month</option>
              <option value="today">Today</option>
            </select>
          </div>
        </div>
        <div className="w-1/2" style={{ height: "300px" }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mt-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
