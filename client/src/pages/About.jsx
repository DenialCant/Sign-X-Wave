import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function About() {
  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Row>
        <Col>
          <h1>About us</h1>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
