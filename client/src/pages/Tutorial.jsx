import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Levels.css"; 
//import "./Tutorial.css"; // Ensure you have a CSS file for styling

const Tutorial = () => {
  const { letter } = useParams(); // Get the letter from the route parameter
  const navigate = useNavigate(); // Hook to navigate between pages

  // go back to levels page 
  const backtoLevel = () => {
    navigate("/levels");
  };
  
  // go to next letter 
  const nextLetter = () => {
    if (letter === 'Z') return;
    const next = String.fromCharCode(letter.charCodeAt(0) + 1);
    navigate(`/tutorial/${next}`);
  };


  const handleStartSigning = () => {
    navigate(`/sign/${letter}`); // Navigate to the signing page for the selected letter
  };

  return (
    <div className="tutorial-container">
      <h1>Tutorial for Letter: {letter}</h1>
      <p>Learn how to sign the letter "{letter}" in ASL.</p>

      {/* Dynamically load the image for the selected letter */}
      <div className="asl-image-container">
        <img
          src={`/handTutorials/${letter.toUpperCase()}.png`} // Ensure the images are in the public/handTutorials folder
          alt={`ASL Letter ${letter}`}
          className="asl-image"
        />
      </div>

      <p>Follow the instructions below to practice signing this letter.</p>
      <ul>
        <li>Step 1: Observe the hand pose for the letter "{letter}".</li>
        <li>Step 2: Try to replicate the pose with your hand.</li>
        <li>Step 3: Use the camera to verify your sign.</li>
      </ul>

      {/* Button container to layout buttons side by side */}
    <div className="grid-tutorial">
      <button onClick={handleStartSigning}>Start"{letter}"</button>
      <button onClick={nextLetter} >Next</button>
      <button onClick={backtoLevel}>Exit</button>
    </div>  
  </div>
  );
};

export default Tutorial;