import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import NavBar from "./NavBar";
import FeedbackForm from "./pages/FeedbackForm";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardStaff from "./pages/DashboardStaff";
import AdminFeed from "./pages/admin_feed";
import AdminUsers from "./pages/active_users";
import StaffFeedbackTable from "./pages/staff_feed";
const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/admin-dashboard" element={<DashboardAdmin />} />
        <Route path="/staff-dashboard" element={<DashboardStaff />} />
        <Route path="/admin-feedback" element={<AdminFeed />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/staff-feedback-table" element={<StaffFeedbackTable />} />
      </Routes>
    </Router>
  );
};

export default App;
