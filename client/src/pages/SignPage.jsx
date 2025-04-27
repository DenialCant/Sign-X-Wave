import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import axios from "axios";

const SignPage = () => {
  const webcamRef = useRef(null);
  const [prediction, setPrediction] = useState("");

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
        
        axios.post("http://localhost:5004/predict", { landmarks })
          .then((response) => {
            setPrediction(response.data.letter);
            console.log("Prediction:", response.data.letter);
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
  }, []);

  return (
    <div className="sign-page">
      <h1>Sign Detection</h1>
      <h2>Predicted: {prediction}</h2>
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
