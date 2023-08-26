const express = require('express');
const app = express();
const path = require('path'); // Node.js module for working with file and directory paths

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// Helper function to generate a unique number identifier
function generateUniqueNumber() {
  const timestamp = new Date().getTime();
  const randomValue = Math.floor(Math.random() * 10000);
  return `${timestamp}-${randomValue}`;
}

// Queue to store registered patients
const queue = [];
app.post('/addpatient', (req, res) => {
  const patient = req.body;
  const uniqueNumber = generateUniqueNumber();

  queue.push({ uniqueNumber, patient });

  console.log(`Registered successfully! Your unique number is: ${uniqueNumber}`);
  res.status(201).send()
});

app.get('/queue', (req, res) => {
  res.sendFile(path.join(__dirname, 'queue.html'));
});

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/nurse', (req, res) => {
  res.sendFile(path.join(__dirname, 'nurse.html'));
});

app.get('/addpatient', (req, res) => {
  res.sendFile(path.join(__dirname, 'addpatient.html'));
});
app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
