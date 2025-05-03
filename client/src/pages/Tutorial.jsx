import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Tutorial.css"; // Ensure you have a CSS file for styling

const Tutorial = () => {
  const { letter } = useParams(); // Get the letter or word from the route parameter
  const navigate = useNavigate(); // Hook to navigate between pages

  // Go back to levels page
  const backtoLevel = () => {
    navigate("/levels");
  };

  // Go to next letter or word
  const nextLetter = () => {
    const levelSequence = [
      ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), // Letters A-Z
      "hello",
      "my",
      "name",
      "is",
    ];
  
    // Ensure the comparison works for both letters and words
    const currentIndex = levelSequence.indexOf(
      levelSequence.includes(letter.toUpperCase()) ? letter.toUpperCase() : letter.toLowerCase()
    );
  
    if (currentIndex !== -1 && currentIndex < levelSequence.length - 1) {
      const nextLevel = levelSequence[currentIndex + 1];
      navigate(`/tutorial/${nextLevel}`);
    } else {
      console.log("No more levels available.");
    }
  };

  const handleStartSigning = () => {
    navigate(`/sign/${letter}`); // Navigate to the signing page for the selected letter or word
  };

  // Determine if the current tutorial is for a word or a letter
  const isWord = ["hello", "my", "name", "is"].includes(letter.toLowerCase());

  return (
    <div className="tutorial-page">
      <div className="text-container">
        <h1>
          Tutorial for {isWord ? `Word: ${letter}` : `Letter: ${letter}`}
        </h1>
        <p>
          {isWord
            ? `Learn how to sign the word "${letter}" in ASL.`
            : `Learn how to sign the letter "${letter}" in ASL.`}
        </p>

        {/* Dynamically load the image or GIF for the selected letter/word */}
        <div className="asl-image-container">
          {isWord ? (
            <img
              src={`/handTutorials/${letter.toLowerCase()}.gif`} // Ensure the GIFs are in the public/handTutorials folder
              alt={`ASL Word ${letter}`}
              className="asl-image"
            />
          ) : (
            <img
              src={`/handTutorials/${letter.toUpperCase()}.png`} // Ensure the images are in the public/handTutorials folder
              alt={`ASL Letter ${letter}`}
              className="asl-image"
            />
          )}
        </div>

        <p>
          Follow the instructions below to practice signing this{" "}
          {isWord ? "word" : "letter"}.
        </p>
        <ul>
          <li>
            Step 1: Observe the hand pose for the {isWord ? "word" : "letter"} "
            {letter}".
          </li>
          <li>Step 2: Try to replicate the pose with your hand.</li>
          <li>Step 3: Use the camera to verify your sign.</li>
        </ul>
      </div>

      {/* Button container to layout buttons side by side */}
      <div className="grid-tutorial">
        <button onClick={handleStartSigning}>Start "{letter}"</button>
        <button onClick={nextLetter}>Next</button>
        <button onClick={backtoLevel}>Exit</button>
      </div>
    </div>
  );
};

export default Tutorial;