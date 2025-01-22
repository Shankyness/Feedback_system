import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/auth/login/", {
        username,
        password,
      });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("isLoggedIn", "true"); // Set isLoggedIn to true
      if (response.data.role === "Admin") {
        navigate("/admin-dashboard");
      } else if (response.data.role === "Staff") {
        navigate("/staff-dashboard");
      } else {
        alert("Unknown role");
      }
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
