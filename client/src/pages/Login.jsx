import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./loginpage.css";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleInput = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      // Send login request to backend
      const res = await axios.post("http://localhost:8081/login", values);

      if (res.data.success) {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/Levels"); // Redirect to dashboard after successful login
      } else {
        setError(res.data.message); // Display error message from the backend
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              onChange={handleInput}
              value={values.email}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              onChange={handleInput}
              value={values.password}
            />
          </div>
          <button type="submit">Login</button>
          {error && <p className="error-msg">{error}</p>}
          <p className="register-link">
            Don’t have an account? <Link to="/signup">Signup here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
