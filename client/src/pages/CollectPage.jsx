import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { saveAs } from 'file-saver';

const CollectPage = () => {
  const webcamRef = useRef(null);
  const [landmarks, setLandmarks] = useState([]);
  const [collectedData, setCollectedData] = useState([]);
  const [label, setLabel] = useState("A");

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
        const flatLandmarks = results.multiHandLandmarks[0]
          .flatMap(point => [point.x, point.y]);
        setLandmarks(flatLandmarks);
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

  const saveSample = () => {
    if (landmarks.length === 42) {
      const sample = [label, ...landmarks];
      setCollectedData(prev => [...prev, sample]);
      console.log("Sample saved:", sample);
    } else {
      alert("No hand detected! Try again.");
    }
  };

  const downloadCSV = () => {
    if (collectedData.length === 0) {
      alert("No data to download!");
      return;
    }

    const csvContent = collectedData
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "hand_landmarks_data.csv");
  };

  return (
    <div className="collect-page">
      <h1>Data Collection</h1>
      <h2>Current Label: {label}</h2>
      <input
        type="text"
        value={label}
        maxLength="1"
        onChange={(e) => setLabel(e.target.value.toUpperCase())}
        placeholder="Enter Letter"
        style={{ fontSize: "20px", textAlign: "center", marginBottom: "10px" }}
      />
      <br />
      <button onClick={saveSample} style={{ marginRight: "10px" }}>
        Save Sample
      </button>
      <button onClick={downloadCSV}>
        Download CSV
      </button>

      <div style={{ marginTop: "20px" }}>
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
    </div>
  );
};

export default CollectPage;
