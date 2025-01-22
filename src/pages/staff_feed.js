import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const StaffFeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editedText, setEditedText] = useState("");
  const authToken = localStorage.getItem("access_token");

  const fetchFeedbacks = async (page = 1) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/feedback/dashboard/staff/?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setFeedbacks(response.data.feedbacks);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page);
    } catch (err) {
      setError("Failed to fetch feedbacks.");
    }
  };

  useEffect(() => {
    fetchFeedbacks(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback.id);
    setEditedText(feedback.feedback_text);
  };

  const handleDelete = async (feedbackId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this feedback?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:8000/feedback/${feedbackId}/delete/`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        fetchFeedbacks(currentPage);
      } catch (err) {
        setError("Failed to delete feedback.");
      }
    }
  };

  const handleSave = async (feedbackId) => {
    const confirmSave = window.confirm(
      "Are you sure you want to save the edited data?"
    );
    if (confirmSave) {
      try {
        await axios.put(
          `http://localhost:8000/feedback/${feedbackId}/edit/`,
          { feedback_text: editedText },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setEditingFeedback(null);
        fetchFeedbacks(currentPage);
      } catch (err) {
        setError("Failed to update feedback.");
      }
    }
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
        className="text-3xl font-bold mb-6 text-center"
      >
        All Feedbacks
      </motion.h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <motion.div
        className="w-full max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.table
          className="table-fixed w-full bg-white shadow-lg rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr className="bg-blue-500 text-white text-center">
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Feedback</th>
              <th className="px-4 py-2">Sentiment</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Edit</th>
              <th className="px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <motion.tr
                  key={feedback.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-blue-100 text-center"
                >
                  <td className="border-t px-4 py-2">{feedback.category}</td>
                  <td className="border-t px-4 py-2">
                    {feedback.product_name}
                  </td>
                  <td className="border-t px-4 py-2">
                    {editingFeedback === feedback.id ? (
                      <input
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      feedback.feedback_text
                    )}
                  </td>
                  <td className="border-t px-4 py-2">{feedback.sentiment}</td>
                  <td className="border-t px-4 py-2">
                    {formatDate(feedback.created_at)}
                  </td>
                  <td className="border-t px-4 py-2">
                    {editingFeedback === feedback.id ? (
                      <button
                        onClick={() => handleSave(feedback.id)}
                        className="text-blue-500"
                      >
                        Save
                      </button>
                    ) : (
                      <FaEdit
                        className="cursor-pointer text-blue-500 mx-auto"
                        onClick={() => handleEdit(feedback)}
                      />
                    )}
                  </td>
                  <td className="border-t px-4 py-2">
                    <FaTrashAlt
                      className="cursor-pointer text-red-500 mx-auto"
                      onClick={() => handleDelete(feedback.id)}
                    />
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="border-t px-4 py-2 text-center font-medium text-gray-600"
                >
                  No feedbacks found.
                </td>
              </tr>
            )}
          </tbody>
        </motion.table>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-4 flex justify-center items-center"
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 disabled:opacity-50 transition-transform transform hover:scale-105"
        >
          Previous
        </button>
        <span className="mx-4 text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 disabled:opacity-50 transition-transform transform hover:scale-105"
        >
          Next
        </button>
      </motion.div>
    </div>
  );
};

export default StaffFeedbackTable;
