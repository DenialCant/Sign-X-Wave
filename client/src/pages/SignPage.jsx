import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import './SignPage.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5018";

const SignPage = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const { word } = useParams();
  const expectedWord = word?.toLowerCase() || "hello";
  const [prediction, setPrediction] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    console.log("Prediction updated:", prediction);
  }, [prediction]);

  useEffect(() => {
    const hands = new Hands({
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
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0]
          .flatMap((point) => [point.x, point.y]);

          axios.post(`${API_URL}/predict`, {
            landmarks,
            mode: "word"
          })          
          .then((response) => {
            const predictedWord = response.data.letter;
            setPrediction(predictedWord);
            console.log("Prediction:", predictedWord);

            if (predictedWord === expectedWord) {
              setSuccessMessage("✅ Good job!");
              setTimeout(() => {
                navigate("/levels");
              }, 2000);
            }
          })
          .catch((error) => {
            console.error("Prediction error:", error);
          });
      }
    });

    if (webcamRef.current) {
      const camera = new Camera(webcamRef.current, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, [expectedWord, navigate]);

  return (
    <div className="sign-page">
      <h1>Sign Detection Practice</h1>
      <h2>Sign This Word: {expectedWord}</h2>
      <h2>Your Prediction: {prediction}</h2>

      {prediction === expectedWord && (
        <p style={{ color: "green" }}>✅ Correct!</p>
      )}

      {successMessage && (
        <h2 style={{ color: "green", marginTop: "20px" }}>{successMessage}</h2>
      )}

      <video
        ref={webcamRef}
        className="webcam"
        autoPlay
        playsInline
        muted
      />
    </div>
  );
};

export default SignPage;


