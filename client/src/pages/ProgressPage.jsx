import React, { useEffect, useState } from 'react';
import RegistrationNavbar from '../components/RegistrationNavbar';

import './ProgressPage.css';

function ProgressPage() {
  const [letters, setLetters] = useState([]);
  const [words, setWords] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("progress")) || { letters: [], words: [] };
    setLetters(saved.letters || []);
    setWords(saved.words || []);
  }, []);

  return (
    <div className="progress-background">
        <RegistrationNavbar /> 
      <div className="progress-header-line"></div>
      <div className="progress-container">
        <h1 className="progress-title">My Progress</h1>

        <div className="progress-section">
          <h2>Completed</h2>
          <p>{words.length > 0 ? words.join(", ") : "None yet!"}</p>
          <div className="progress-footer">
           <button className="back-button" onClick={() => window.location.href = '/levels'}>
             ⬅ Back to Levels
           </button>
          </div>

        </div>


      </div>
    </div>
  );
}

export default ProgressPage;