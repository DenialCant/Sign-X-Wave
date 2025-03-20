const express = require('express');
const spawn = require('cross-spawn');
const path = require('path');
const app = express();
const port = 3001;

console.log('Starting server...');

app.get('/run-detector', (req, res) => {
  console.log('Received request to run detector');
  const detectorPath = path.join(__dirname, '../client/src/detector');
  console.log(`Detector path: ${detectorPath}`);

  // Start the Python script asynchronously
  const runApp = spawn('python', ['app.py'], { cwd: detectorPath, shell: true });
  runApp.stdout.on('data', (data) => {
    console.log(`Run stdout: ${data}`);
  });
  runApp.stderr.on('data', (data) => {
    console.error(`Run stderr: ${data}`);
  });
  runApp.on('close', (code) => {
    if (code !== 0) {
      console.error(`python app.py process exited with code ${code}`);
    } else {
      console.log('Detector started successfully');
    }
  });

  // Respond to the client immediately
  res.send('Detector is starting...');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});