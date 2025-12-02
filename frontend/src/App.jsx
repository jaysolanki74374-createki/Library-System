import React, { useContext } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminBooks from "./pages/AdminBooks";
import AdminIssues from "./pages/AdminIssues";
import ReaderBooks from "./pages/ReaderBooks";
import ReaderHistory from "./pages/ReaderHistory";

import "./components/Header.css";

// Logged in or not
function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

// ADMIN ONLY
function RequireAdmin({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/books" />;
  return children;
}

// READER ONLY
function RequireReader({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "reader") return <Navigate to="/admin/books" />;
  return children;
}

export default function App() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Hide header only on welcome page
  const hideHeader = location.pathname === "/";

  return (
    <div className="app-container">

      {/* HEADER */}
      {!hideHeader && (
        <header className="app-header">
          <div className="nav-links">
            {user && user.role === "admin" && (
              <>
                <Link className="nav-link" to="/admin/books">Admin Books</Link>
                <Link className="nav-link" to="/admin/issues">Issued</Link>
              </>
            )}
      
            {user && user.role === "reader" && (
              <>
                <Link className="nav-link" to="/books">Books</Link>
                <Link className="nav-link" to="/history">History</Link>
              </>
            )}
          </div>
      
          {user && (
            <div className="nav-user">
              {user.name} ({user.role})
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          )}
        </header>
      )}

      {/* ROUTES */}
      <Routes>

        {/* Public */}
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <RegisterPage />}
        />

        {/* ADMIN ONLY ROUTES */}
        <Route
          path="/admin/books"
          element={<RequireAdmin><AdminBooks /></RequireAdmin>}
        />
        <Route
          path="/admin/issues"
          element={<RequireAdmin><AdminIssues /></RequireAdmin>}
        />

        {/* READER ONLY ROUTES */}
        <Route
          path="/books"
          element={<RequireReader><ReaderBooks /></RequireReader>}
        />
        <Route
          path="/history"
          element={<RequireReader><ReaderHistory /></RequireReader>}
        />
      </Routes>
    </div>
  );
}
