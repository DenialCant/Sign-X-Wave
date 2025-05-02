import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PracticeIntro() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (name.trim()) {
      navigate(`/practice/run?name=${encodeURIComponent(name.trim())}`);
    }
  };

  return (
    <div className="sign-page">
      <h1>Practice Module</h1>
      <p>Enter your name to begin:</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ fontSize: "20px", padding: "8px" }}
        placeholder="Your name"
      />
      <br />
      <button onClick={handleStart} style={{ padding: "10px 20px", marginTop: "20px" }}>
        Start Practice
      </button>
    </div>
  );
}

export default PracticeIntro;
