import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import { FaSearch, FaFilter, FaFileCsv } from "react-icons/fa";

const AdminFeed = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const authToken = localStorage.getItem("access_token");

  // Fetch feedbacks with search and filter
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/feedback/dashboard/admin/",
          {
            params: { search, category: filter, page },
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setFeedbacks(response.data.feedbacks);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, [search, filter, page, authToken]);

  const csvHeaders = [
    { label: "User", key: "user__username" },
    { label: "Category", key: "category" },
    { label: "Product", key: "product_name" },
    { label: "Feedback", key: "feedback_text" },
    { label: "Sentiment", key: "sentiment" },
  ];

  return (
    <div className="p-8 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Feedbacks
      </h1>

      {/* Search, Filter, and Export Section */}
      <div className="flex flex-wrap items-center gap-4 mb-8 justify-between">
        <CSVLink
          headers={csvHeaders}
          data={feedbacks}
          filename="feedbacks.csv"
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 flex items-center"
        >
          <FaFileCsv className="mr-2" /> Export CSV
        </CSVLink>
        <div className="flex items-center space-x-4">
          <div className="w-full md:w-64">
            <label htmlFor="search" className="block mb-2 font-semibold">
              Search
            </label>
            <div className="flex">
              <input
                id="search"
                type="text"
                placeholder="Search feedback..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-l-lg focus:outline-blue-400 shadow-md w-full"
              />
              <div className="bg-blue-500 text-white px-4 py-2 rounded-r-lg flex items-center justify-center">
                <FaSearch />
              </div>
            </div>
          </div>
          <div className="w-full md:w-64">
            <label htmlFor="filter" className="block mb-2 font-semibold">
              Filter
            </label>
            <div className="flex">
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-l-lg focus:outline-blue-400 shadow-md w-full"
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
              <div className="bg-blue-500 text-white px-4 py-2 rounded-r-lg flex items-center justify-center">
                <FaFilter />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Feedback</th>
              <th className="px-4 py-3 text-left">Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <tr key={feedback.id} className="border-b hover:bg-blue-50">
                  <td className="px-4 py-3">{feedback.user__username}</td>
                  <td className="px-4 py-3">{feedback.category}</td>
                  <td className="px-4 py-3">{feedback.product_name}</td>
                  <td className="px-4 py-3">{feedback.feedback_text}</td>
                  <td className="px-4 py-3">{feedback.sentiment}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-600">
                  No feedbacks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminFeed;
