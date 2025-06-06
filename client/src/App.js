import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

// import pages
import Homepage from './pages/Homepage';
import About from './pages/About';
import Login from './pages/Login';
import Levels from './pages/Levels';
import Signup from './pages/Signup';
import SignPage from "./pages/SignPage";

import CollectPage from './pages/CollectPage';
import Tutorial from './pages/Tutorial';
import PracticePage from './pages/PracticeRun';
import Alphabet from './pages/Alphabet';
import PracticeIntro from './pages/PracticeIntro';
import PracticeRun from './pages/PracticeRun';
import ProgressPage from './pages/ProgressPage';


import PrivateRoute from "./pages/PrivateRoute";
//import CollectPage from './pages/CollectPage';
//import Tutorial from './pages/Tutorial'; //>>>>>>> 4cb04012b29b1200a11ee0afd11f0213697d9f98


// import components
//import Navigation from './components/Navigation';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />

        {/* private route need authentication to access */}
        <Route 
          path="/levels" 
          element={
            <PrivateRoute>
              <Levels />
            </PrivateRoute>
          } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sign/:word" element={<SignPage />} />
        <Route path="/collect" element={<CollectPage />} />

        <Route path="/alphabet/:letter" element={<Alphabet />} />
        <Route path="/tutorial/:letter" element={<Tutorial />} />
        <Route path="/practice" element={<PracticeIntro />} />
        <Route path="/practice/run" element={<PracticeRun />} />

        {/* Add more routes as needed */}

        <Route path="/tutorial/:letter" element={<Tutorial />} />
        <Route path="/progresspage" element={<ProgressPage />} />

        {/* Catch-all route for 404 */}
      </Routes>
    </div>
  );
}

export default App;
