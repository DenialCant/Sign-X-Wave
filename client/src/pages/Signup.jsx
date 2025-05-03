import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import RegistrationNavbar from "../components/RegistrationNavbar";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleInput = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Clear error on new attempt

    try {
      const res = await axios.post("http://localhost:8081/signup", values);
      if (res.status === 200) {
        navigate("/"); // Navigate to home or login page
      }
    } catch (err) {
      console.error("Signup failed:", err);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-background">
      <RegistrationNavbar />
      <header className="signup-header"></header>

      <div className="signup-form-container">
        <h1>Sign Up</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            onChange={handleInput}
          />

          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            onChange={handleInput}
          />

          <label htmlFor="password">Password*</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            onChange={handleInput}
          />

          <button type="submit">Create Account</button>
          {error && <p className="error-msg">{error}</p>}
          <p className="login-redirect">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;