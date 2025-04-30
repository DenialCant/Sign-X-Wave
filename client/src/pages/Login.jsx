import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import RegistrationNavbar from "../components/RegistrationNavbar";

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
    <div className="signup-background">
        <RegistrationNavbar/>{}
    <header className="signup-header">

    </header>

    <div className="signup-form-container">
      <h1>Login</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>Email*</label>
        <input type="email" name="email" required onChange={handleInput} />

        <label>Password*</label>
        <input type="password" name="password" required onChange={handleInput} />

        <button type="submit">Login</button>
        {error && <p className="error-msg">{error}</p>}
        <p className="login-redirect">
          Don't have an account? <Link to="/signup">Signup here</Link>
        </p>
      </form>
    </div>
  </div>
  );
};

export default Login;
