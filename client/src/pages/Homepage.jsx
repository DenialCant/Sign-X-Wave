import React from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css"; 

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className>
        <h2>Welcome</h2>
        <div className="button-row">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")}>Signup</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
