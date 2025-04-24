import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <Navbar expand="lg"classname="custom-navbar" >
      <Navbar.Brand as={Link} to="/" style={{ marginLeft: '10px' }}>Sign-X-Wave</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/" style={{ marginRight: '20px', marginLeft: '10px' }}>Home</Nav.Link>
          <Nav.Link as={Link} to="/about" style={{ marginRight: '20px' }}>About</Nav.Link>
          <Nav.Link as={Link} to="/login" style={{ marginRight: '20px' }}>Login</Nav.Link>
          <Nav.Link as={Link} to="/signup" style={{ marginRight: '20px' }}>Signup</Nav.Link>
          <Nav.Link as={Link} to="/levels" style={{ marginRight: '20px' }}>Levels</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
