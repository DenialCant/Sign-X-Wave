import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
//import './Tutorial.css';

function Tutorial() {
  const navigate = useNavigate();
  const { letter } = useParams(); 

  const handleStartLevel = () => {
    navigate(`/sign/${letter}`);
  };

  return (
    <div className="tutorial-container">
      <h1>Tutorial for Level {letter}</h1>
      <p>Welcome to the tutorial for the letter "{letter}". Follow the instructions below to learn how to complete this level.</p>
      <ul>
        <li>Step 1: Do this...</li>
        <li>Step 2: Do that...</li>
        <li>Step 3: You're ready to start!</li>
      </ul>
      <Button variant="primary" onClick={handleStartLevel}>
        Start Level {letter}
      </Button>
    </div>
  );
}

export default Tutorial;