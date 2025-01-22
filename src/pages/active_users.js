import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaTrashAlt } from "react-icons/fa"; // Importing the trash icon

const AdminUsers = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const authToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/feedback/active-users/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setActiveUsers(response.data.active_users);
      } catch (error) {
        setError("Failed to fetch active users.");
      }
    };

    fetchActiveUsers();
  }, [authToken]);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await axios.delete(
          `http://localhost:8000/feedback/${userToDelete.username}/`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setActiveUsers(
          activeUsers.filter((user) => user.username !== userToDelete.username)
        );
        setShowModal(false);
        setUserToDelete(null);
      } catch (error) {
        setError("Failed to delete user.");
      }
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  return (
    <div className="p-8 bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6"
      >
        Registered Users
      </motion.h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.table
          className="min-w-full bg-white shadow-lg rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr className="bg-blue-500 text-white">
              <th
                className="px-4 py-2 text-center align-middle"
                style={{ width: "20%" }}
              >
                Username
              </th>
              <th
                className="px-4 py-2 text-center align-middle"
                style={{ width: "20%" }}
              >
                Email
              </th>
              <th
                className="px-4 py-2 text-center align-middle"
                style={{ width: "20%" }}
              >
                Date Registered
              </th>
              <th
                className="px-4 py-2 text-center align-middle"
                style={{ width: "20%" }}
              >
                Role
              </th>
              <th
                className="px-4 py-2 text-center align-middle"
                style={{ width: "20%" }}
              >
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {activeUsers.length > 0 ? (
              activeUsers.map((user) => (
                <tr key={user.username} className="hover:bg-blue-100">
                  <td className="border-t px-4 py-2 text-center align-middle">
                    {user.username}
                  </td>
                  <td className="border-t px-4 py-2 text-center align-middle">
                    {user.email}
                  </td>
                  <td className="border-t px-4 py-2 text-center align-middle">
                    {formatDate(user.date_joined)}
                  </td>
                  <td className="border-t px-4 py-2 text-center align-middle">
                    {user.role}
                  </td>
                  <td className="border-t px-4 py-2 text-center align-middle">
                    <FaTrashAlt
                      className="cursor-pointer text-red-500 inline-block align-middle"
                      onClick={() => handleDeleteClick(user)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border-t px-4 py-2 text-center">
                  No active users found.
                </td>
              </tr>
            )}
          </tbody>
        </motion.table>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }} // Shorter transition duration
            className="bg-white p-8 rounded-lg shadow-lg z-10"
          >
            <h2 className="text-2xl mb-4">
              Are you sure you want to delete this user?
            </h2>
            <div className="flex justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                OK
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
