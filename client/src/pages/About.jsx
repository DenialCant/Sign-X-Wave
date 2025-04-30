import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function About() {
  return (
    <Container fluid style={{ height: '100vh' }}>
      <Row className="h-100 justify-content-center align-items-center">
        <Col md={8} className="text-center">
          <h1>About Us</h1>
          <p>
            Our sign language learning model uses interactive video lessons and real-time practice sessions to teach users 
            how to understand and communicate effectively in sign language, offering immediate feedback to enhance learning and retention.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
