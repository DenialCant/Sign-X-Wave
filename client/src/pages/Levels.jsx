import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './Levels.css'; // Import custom CSS for styling

function Levels() {
  const handleButtonClick = (letter) => {
    console.log(`Button ${letter} clicked`);
    // You can add more logic here if needed
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
        <Col className="text-center">
          <h1>This is the Levels page</h1>
          <Button variant="primary" onClick={() => handleButtonClick('Run Detector')}>Run Detector</Button>
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