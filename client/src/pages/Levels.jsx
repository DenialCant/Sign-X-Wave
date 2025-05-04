import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import RegistrationNavbar from "../components/RegistrationNavbar";
import { useEffect, useState } from "react";
import "./Levels.css";

function Levels() {
  const navigate = useNavigate();


  // Navigate to the tutorial page for a letter
  const handleLetterClick = (letter) => {
    navigate(`/tutorial/${letter}`);
  };

  // Navigate to the tutorial page for a word
  const handleWordClick = (word) => {
    navigate(`/tutorial/${word}`);
  };

  // Navigate to the practice module
  const handlePracticeClick = () => {
    navigate("/practice");
  };

  // Logout and navigate to the login page
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  // Alphabet letters
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Words for the "Introduce Yourself" section
  const introWords = ["hello", "my", "name", "is"];

  return (
    <>
      <RegistrationNavbar />
      <div className="levels-header-line"></div> {/* White line separator */}
      <div className="levels-background">
        <Container fluid className="levels-page">
          {/* Logout Button */}
          <Button className="logout-button" onClick={handleLogout}>
            Logout
          </Button>
          
          <div className="progress-button-container">
            <Button className="progress-button" onClick={() => navigate("/progresspage")}>
              View Progress
            </Button>
          </div>

          {/* Alphabet Levels */}
          {/* View Progress Button */}
          <div className="progress-button-container">
          </div>
          <h1 className="section-title">Alphabet Levels</h1>
          <div className="grid-container">
            {letters.map((letter) => (
              <div key={letter} className="grid-item">
                <button onClick={() => handleLetterClick(letter)}>{letter}</button>
              </div>
            ))}
          </div>

          {/* Introduce Yourself Levels */}
          <h1 className="section-title">Introduce Yourself</h1>
          <div className="grid-container">
            {introWords.map((word) => (
              <div key={word} className="grid-item">
                <button onClick={() => handleWordClick(word)}>{word.toUpperCase()}</button>
              </div>
            ))}
          </div>

          {/* Practice Module */}
          <h1 className="section-title">Practice Module</h1>
          <div className="grid-container">
            <div className="grid-item">
              <button onClick={handlePracticeClick}>Start Practice</button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Levels;