import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./pages/PrivateRoute";

import Homepage from "./pages/Homepage";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Levels from "./pages/Levels";
import Navigation from "./components/Navigation";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/levels"
          element={
            <PrivateRoute>
              <Levels />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
