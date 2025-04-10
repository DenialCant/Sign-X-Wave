const express = require('express');
const spawn = require('cross-spawn');
const path = require('path');
const cors = require('cors'); // Import the CORS middleware
const app = express();
const port = 3001;

let runApp = null; // Track the Python process

console.log('Starting server...');

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from the frontend
}));

// Middleware to parse JSON request bodies
app.use(express.json());

app.post('/run-detector', (req, res) => {
  console.log('Received request to run detector');
  const { action } = req.body; // Extract the action from the request body
  console.log(`Action: ${action}`);
  
  const detectorPath = path.join(__dirname, '../client/src/detector');
  console.log(`Detector path: ${detectorPath}`);

  // Check if the Python script is already running
  if (runApp) {
    console.log('Detector is already running');
    return res.send('Detector is already running.');
  }

  // Use pythonw.exe to run the script without opening a terminal window
  runApp = spawn('pythonw', ['app.py'], { cwd: detectorPath, detached: true, stdio: 'ignore' });

  runApp.unref(); // Allow the process to continue running independently

  // Listen for the process to exit and reset runApp
  runApp.on('exit', (code) => {
    console.log(`Detector process exited with code ${code}`);
    runApp = null; // Reset the process tracker
  });

  runApp.on('error', (err) => {
    console.error('Failed to start detector:', err);
    runApp = null; // Reset the process tracker if it fails to start
  });

  // Respond to the client immediately
  res.send('Detector is starting...');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});