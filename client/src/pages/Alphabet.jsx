import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import axios from "axios";
import { useParams } from 'react-router-dom';
import './SignPage.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5018";

const Alphabet = () => {
  const webcamRef = useRef(null);
  const { letter } = useParams();
  const [prediction, setPrediction] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
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
          .flatMap(point => [point.x, point.y]);

        console.log("Sending to Flask:", { landmarks, mode: "letter" });

        axios.post(`${API_URL}/predict`, {
          landmarks,
          mode: "letter"
        }).then((response) => {
          const predicted = response.data.letter;
          setPrediction(predicted);

          if (predicted === letter.toUpperCase()) {
            setMessage("✅ Correct!");
          } else {
            setMessage("❌ Try again");
          }
        }).catch((error) => {
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
  }, [letter]);

  return (
    <div className="sign-page">
      <h1>Sign This Letter: {letter.toUpperCase()}</h1>
      <h2>Your Prediction: {prediction}</h2>
      <p style={{ color: message.includes("Correct") ? "green" : "red" }}>{message}</p>
      <video ref={webcamRef} className="webcam" autoPlay playsInline muted />
    </div>
  );
};

export default Alphabet;
