import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "reader",
  });

  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setAuth(res.token, res.user);
      navigate("/"); // Redirect after registration
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>

        <form className="auth-form" onSubmit={submit}>
          <input
            className="auth-input"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <select
            className="auth-input"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="reader">Reader</option>
            <option value="admin">Admin</option>
          </select>

          <button className="auth-btn primary">Register</button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
