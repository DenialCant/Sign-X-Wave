import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

// import pages
import Homepage from './pages/Homepage';
import About from './pages/About';
import Login from './pages/Login';
import Levels from './pages/Levels';

// import components
import Navigation from './components/Navigation';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/levels" element={<Levels />} />
      </Routes>
    </div>
  );
}

export default App;
