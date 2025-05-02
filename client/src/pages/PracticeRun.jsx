import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import axios from "axios";
import './SignPage.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5018";

function PracticeRun() {
  const [searchParams] = useSearchParams();
  const webcamRef = useRef(null);
  const [prediction, setPrediction] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [matched, setMatched] = useState(false); 

  const rawName = searchParams.get("name")?.trim().toUpperCase() || "UNKNOWN";
  const rawSentence = `hello my name is ${rawName}`;
  const fullSequence = rawSentence.split(" ").flatMap(word =>
    word.length === 1 ? [word] : [word]
  );

  const currentTarget = fullSequence[stepIndex] || "";
  const isLetter = currentTarget.length === 1;
  const mode = isLetter ? "letter" : "word";

  // Debug logs
  console.log("📜 Sentence:", rawSentence);
  console.log("📦 Sequence:", fullSequence);
  console.log("🎯 Current Target:", currentTarget);
  console.log("🧠 Mode:", mode);

  useEffect(() => {
    if (!currentTarget) return;

    let camera;

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0].flatMap(point => [point.x, point.y]);

        axios.post(`${API_URL}/predict`, {
          landmarks,
          mode,
        })
        .then((res) => {
          const predicted = res.data.letter;
          setPrediction(predicted);

          if (!matched && predicted.toLowerCase() === currentTarget.toLowerCase()) {
            setMatched(true);
            setTimeout(() => {
              setStepIndex((prev) => prev + 1);
              setMatched(false);
            }, 1000);
          }
        })
        .catch((err) => {
          console.error("Prediction error:", err);
        });
      }
    });

    if (webcamRef.current) {
      camera = new Camera(webcamRef.current, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }

    return () => {
      if (camera) camera.stop();
    };
  }, [stepIndex, mode, currentTarget, matched]);

  return (
    <div className="sign-page">
      <h1>Practice Sentence</h1>
      {stepIndex < fullSequence.length ? (
        <>
          <h2>Sign This: <strong>{currentTarget}</strong></h2>
          <h3>Your Prediction: {prediction}</h3>
          <video ref={webcamRef} className="webcam" autoPlay playsInline muted />
        </>
      ) : (
        <h2 style={{ color: "green" }}>🎉 Practice Complete!</h2>
      )}
    </div>
  );
}

export default PracticeRun;
