import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const SignPage = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const { letter } = useParams();
  const [expectedLetter, setExpectedLetter] = useState(letter || "A");
  const [prediction, setPrediction] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setExpectedLetter(letter); // Update the expected letter when the route changes
    setPrediction(""); // Reset the prediction for the new letter
    setSuccessMessage(""); // Clear the success message
  }, [letter]);

  useEffect(() => {
    let hands = null; // Declare hands instance
    let camera = null; // Declare camera instance
    let isComponentMounted = true; // Track if the component is still mounted

    const initializeHands = async () => {
      hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results) => {
        if (!isComponentMounted) return; // Prevent processing if the component is unmounted

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0].flatMap((point) => [
            point.x,
            point.y,
          ]);

          axios
            .post("http://localhost:5006/predict", { landmarks })
            .then((response) => {
              const predictedLetter = response.data.letter;
              setPrediction(predictedLetter);
              console.log("Prediction:", predictedLetter);

              if (predictedLetter === expectedLetter) {
                setSuccessMessage("✅ Good job!");
                setTimeout(() => {
                  navigate("/levels");
                }, 2000); // Redirect back to Levels after 2 seconds
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
            if (isComponentMounted && webcamRef.current) {
              await hands.send({ image: webcamRef.current });
            }
          },
          width: 640,
          height: 480,
        });
        camera.start();
      }
    };

    initializeHands();

    // Cleanup function to stop camera and hands instances
    return () => {
      isComponentMounted = false; // Mark the component as unmounted
      if (camera) {
        camera.stop(); // Stop the camera
        camera = null; // Ensure the camera instance is cleared
      }
      if (hands) {
        hands.close(); // Close the hands instance
        hands = null; // Ensure the hands instance is cleared
      }
    };
  }, [expectedLetter, navigate]);

  return (
    <div className="sign-page">
      <h1>Sign Detection Practice</h1>
      <h2>Sign This Letter: {expectedLetter}</h2>
      <h2>Your Prediction: {prediction}</h2>

      {successMessage && (
        <h2 style={{ color: "green", marginTop: "20px" }}>{successMessage}</h2>
      )}

      <video
        ref={webcamRef}
        width="640"
        height="480"
        style={{ width: "640px", height: "480px" }}
        autoPlay
        playsInline
        muted
      />
    </div>
  );
};

export default SignPage;