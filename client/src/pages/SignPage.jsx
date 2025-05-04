import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./SignPage.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5020";

const SignPage = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null); // Ref for the canvas to capture the frame
  const navigate = useNavigate();
  const { word } = useParams();
  const expectedWord = word?.toLowerCase() || "hello";
  const [prediction, setPrediction] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false); // State to track if the video is paused
  const [showButtons, setShowButtons] = useState(false); // State to show/hide buttons
  const updateProgress = (type, value) => {
    const progress = JSON.parse(localStorage.getItem("progress")) || {
      letters: [],
      words: []
    };
  
    if (!progress[type].includes(value)) {
      progress[type].push(value);
      localStorage.setItem("progress", JSON.stringify(progress));
    }
  };
  

  let lastPredictionTime = useRef(0); // Track the time of the last prediction

  useEffect(() => {
    let hands = null; // Declare hands instance
    let camera = null; // Declare camera instance
    let isComponentMounted = true; // Track if the component is still mounted

    const initializeHands = async () => {
      hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results) => {
        if (!isComponentMounted) return; // Prevent processing if the component is unmounted

        const currentTime = Date.now();
        if (currentTime - lastPredictionTime.current < 500) {
          // Throttle predictions to every 500ms
          return;
        }
        lastPredictionTime.current = currentTime;

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0].flatMap((point) => [
            point.x,
            point.y,
          ]);

          axios
            .post(`${API_URL}/predict`, {
              landmarks,
              mode: word.length === 1 ? "letter" : "word", // Dynamically set mode
            })
            .then((response) => {
              const predictedWord = response.data.letter;
              setPrediction(predictedWord);

              if (predictedWord.toLowerCase() === expectedWord.toLowerCase()) {
                updateProgress("words", predictedWord); //new line
                setSuccessMessage("✅ Good job!");
                pauseVideo(); // Pause the video feed
                setShowButtons(true); // Show the buttons
              }
            })
            .catch((error) => {
              console.error("Prediction error:", error);
            });
        }
      });

      if (webcamRef.current) {
        camera = new Camera(webcamRef.current, {
          onFrame: async () => {
            if (isComponentMounted) {
              try {
                await hands.send({ image: webcamRef.current });
              } catch (error) {
                console.error("Error sending frame to MediaPipe Hands:", error);
              }
            }
          },
          width: 640,
          height: 480,
        });
        camera.start();
      }
    };

    const pauseVideo = () => {
      if (webcamRef.current && canvasRef.current) {
        const video = webcamRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Pause the video feed
        setIsPaused(true);
      }
    };

    const stopDetector = () => {
      if (camera) {
        camera.stop(); // Stop the camera
        camera = null; // Ensure the camera instance is cleared
      }
      if (hands) {
        hands.close(); // Close the hands instance
        hands = null; // Ensure the hands instance is cleared
      }
    };

    initializeHands();

    // Cleanup function to stop camera and hands instances
    return () => {
      isComponentMounted = false; // Mark the component as unmounted
      stopDetector();
    };
  }, [expectedWord, navigate, word]);

  const handleNextLevel = () => {
    const levelSequence = [
      ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)), // Letters a-z
      "hello",
      "my",
      "name",
      "is",
    ];
  
    const currentIndex = levelSequence.indexOf(expectedWord.toLowerCase());
  
    if (currentIndex !== -1 && currentIndex < levelSequence.length - 1) {
      const nextLevel = levelSequence[currentIndex + 1];
      navigate(`/tutorial/${nextLevel}`);
    } else {
      console.log("No more levels available.");
    }
  };

  const handleGoBack = () => {
    navigate("/levels");
  };

  const handleGoBackToTutorial = () => {
    navigate(`/tutorial/${word}`);
  };

  return (
    <div className="sign-page">
  <div className="text-container">
    <h1>Sign Detection Practice</h1>
    <h2>Sign This Word: {expectedWord}</h2>
    <h2>Your Prediction: {prediction}</h2>

    {prediction.toLowerCase() === expectedWord.toLowerCase() && (
      <p style={{ color: "green" }}>✅ Correct!</p>
    )}

    {successMessage && (
      <h2 style={{ color: "green", marginTop: "20px" }}>{successMessage}</h2>
    )}
  </div>

  {/* "Go Back to Tutorial" Button */}
  <div className="grid-tutorial">
    <button onClick={handleGoBackToTutorial}>Back</button>
  </div>

  <div className="video-container">
    {/* Video feed or captured frame */}
    {!isPaused ? (
      <video
        ref={webcamRef}
        className="webcam"
        autoPlay
        playsInline
        muted
      />
    ) : (
      <canvas
        ref={canvasRef}
        className="webcam"
        width="640"
        height="480"
      />
    )}

    {/* "Go Back to Levels" Button */}
    {showButtons && (
      <button className="go-back-button" onClick={handleGoBack}>
        Go Back to Levels
      </button>
    )}

    {/* "Next Level" Button */}
    {showButtons && (
      <button className="next-level-button" onClick={handleNextLevel}>
        Next Level
      </button>
    )}
  </div>
</div>
  );
};

export default SignPage;