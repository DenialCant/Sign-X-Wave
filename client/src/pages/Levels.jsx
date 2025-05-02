/*import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './Levels.css';

function Levels() {
  const navigate = useNavigate();

  const handleButtonClick = (letter) => {
    console.log(`Button ${letter} clicked`);
    navigate(`/tutorial/${letter}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const letters = [
    'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z'
  ];

  return (
    <Container fluid className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh', overflowY: 'auto', paddingTop: '60px' }}>
      
        <Row>
        <Button variant="danger" 
        className="logout-button"
        onClick={handleLogout}>Logout</Button>
        </Row>
      
      <Row>
        <Col className="text-center">
          <h1>Levels</h1>
          <div className="grid-container">
            {letters.map((letter, index) => (
              <div key={index} className="grid-item">
                <button onClick={() => handleButtonClick(letter)}>{letter}</button>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Levels;
*/

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './Levels.css';

function Levels() {
  const navigate = useNavigate();

  const handleLetterClick = (letter) => {
    navigate(`/alphabet/${letter}`);
  };

  const handleWordClick = (word) => {
    navigate(`/sign/${word}`);
  };

  const handlePracticeClick = () => {
    navigate('/practice');
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const introWords = ['hello', 'my', 'name', 'is'];

  return (
    <Container fluid className="levels-page">
      <Button className="logout-button" onClick={handleLogout}>Logout</Button>

      <h1 className="section-title">Alphabet Level</h1>
      <div className="grid-container">
        {letters.map((letter) => (
          <div key={letter} className="grid-item">
            <button onClick={() => handleLetterClick(letter)}>{letter}</button>
          </div>
        ))}
      </div>

      <h1 className="section-title">Introduce Yourself</h1>
      <div className="grid-container">
        {introWords.map((word) => (
          <div key={word} className="grid-item">
            <button onClick={() => handleWordClick(word)}>{word.toUpperCase()}</button>
          </div>
        ))}
      </div>

      <h1 className="section-title">Practice Module</h1>
      <div className="grid-container">
        <div className="grid-item">
          <button onClick={handlePracticeClick}>Start Practice</button>
        </div>
      </div>
    </Container>
  );
}

export default Levels;
