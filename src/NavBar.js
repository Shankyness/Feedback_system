import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FeedbackForm from "./pages/FeedbackForm";

const NavBar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");

  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleDashboardNavigation = () => {
    if (isLoggedIn) {
      if (role?.toLowerCase() === "staff") {
        navigate("/staff-dashboard");
      } else if (role?.toLowerCase() === "admin") {
        navigate("/admin-dashboard");
      }
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <motion.nav
      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-4 shadow-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <button
            onClick={handleDashboardNavigation}
            className="text-white text-2xl font-bold hover:underline"
          >
            Customer Feedback System
          </button>
        </div>
        <div className="space-x-4">
          {isLoggedIn && role?.toLowerCase() === "staff" && (
            <button
              onClick={openModal}
              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Submit Feedback
            </button>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Logout
            </button>
          )}

          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow-lg transition-transform transform hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full shadow-lg transition-transform transform hover:scale-105"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 float-right"
            >
              &#x2715;
            </button>
            <FeedbackForm onClose={closeModal} />
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default NavBar;
