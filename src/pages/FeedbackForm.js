import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const FeedbackForm = ({ onClose }) => {
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetForm = () => {
    setCategory("");
    setProductName("");
    setFeedbackText("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    let token = localStorage.getItem("access_token");

    if (!token) {
      setErrorMessage("User is not authenticated");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/feedback/submit/",
        { category, product_name: productName, feedback_text: feedbackText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      resetForm();
      setSuccessMessage("Feedback submitted successfully!");
      setTimeout(() => {
        onClose(); // Close modal after successful submission
      }, 900); // Delay to show success message briefly
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired. Attempting to refresh...");
        const newToken = await refreshAccessToken();
        if (newToken) {
          try {
            await axios.post(
              "http://localhost:8000/feedback/submit/",
              {
                category,
                product_name: productName,
                feedback_text: feedbackText,
              },
              {
                headers: {
                  Authorization: `Bearer ${newToken}`,
                },
              }
            );
            resetForm();
            setSuccessMessage("Feedback submitted successfully!");
            setTimeout(() => {
              onClose();
            }, 900);
          } catch (retryError) {
            console.error("Retry failed after refreshing token", retryError);
            setErrorMessage("Failed to submit feedback. Please try again.");
          }
        } else {
          setErrorMessage("Session expired. Please log in again.");
        }
      } else {
        const message =
          error.response?.data?.message || "Failed to submit feedback.";
        setErrorMessage(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const response = await axios.post(
        "http://localhost:8000/auth/token/refresh/",
        {
          refresh: refreshToken,
        }
      );
      const newAccessToken = response.data.access;
      localStorage.setItem("access_token", newAccessToken);
      return newAccessToken;
    } catch (err) {
      console.error("Failed to refresh access token", err);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("isLoggedIn");
      return null;
    }
  };

  return (
  <motion.form
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    onSubmit={handleSubmit}
    className="p-4 bg-white rounded shadow-md"
    aria-label="Feedback Form"
  >
    <h2 className="text-2xl font-bold text-center mb-4">Submit Feedback</h2>
    {errorMessage && (
      <div className="text-red-500 text-center mb-2">{errorMessage}</div>
    )}
    <label className="block mb-2">Category</label>
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="w-full mb-4 p-2 border rounded"
      required
    >
      <option value="">Select Category</option>
      <option value="Electronics">Electronics</option>
      <option value="Clothing">Clothing</option>
      <option value="Books">Books</option>
      <option value="Furniture">Furniture</option>
      <option value="Grocery">Grocery</option>
      <option value="Health & Beauty">Health & Beauty</option>
      <option value="Toys">Toys</option>
      <option value="Sports Equipment">Sports Equipment</option>
      <option value="Automobile">Automobile</option>
      <option value="Other">Other</option>
    </select>
    <label className="block mb-2">Product Name</label>
    <input
      type="text"
      value={productName}
      onChange={(e) => setProductName(e.target.value)}
      className="w-full mb-4 p-2 border rounded"
      required
    />
    <label className="block mb-2">Feedback</label>
    <textarea
      value={feedbackText}
      onChange={(e) => setFeedbackText(e.target.value)}
      className="w-full mb-4 p-2 border rounded"
      rows="3"
      required
    ></textarea>
    <button
      type="submit"
      className={`w-full bg-blue-600 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={loading}
    >
      {loading ? "Submitting..." : "Submit"}
    </button>
  </motion.form>
);
}

export default FeedbackForm;
