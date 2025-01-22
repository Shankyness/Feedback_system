import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Staff");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // for implementing custom behaviour instead of browser default behaviour
    const registrationData = { username, email, password, role };

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("Staff");
        navigate("/login"); // Navigate to login on successful registration
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to register"}`);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-600"
          >
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-600"
          >
          Email-ID
          </label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-600"
          >
          Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-600"
          >
          Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
