import React from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css"; 

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
    <div className="title-container">
      <h1 className="logo-text">
        <span className="left">SiGN</span>
        <span className="middle">X</span>
        <span className="right">WAVE</span>
      </h1>

      <div className="button-row">
        <button onClick={() => navigate("/login")} className="home-button">
          Login
        </button>
        <button onClick={() => navigate("/signup")} className="home-button active">
          Sign up
        </button>
      </div>
    </div>
  </div>
 
  );
};

export default Home;
