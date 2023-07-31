const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Helper function to generate a unique number identifier
function generateUniqueNumber() {
  const timestamp = new Date().getTime();
  const randomValue = Math.floor(Math.random() * 10000);
  return `${timestamp}-${randomValue}`;
}

// Queue to store registered patients
const queue = [];

app.post('/register', (req, res) => {
  const patientName = req.body.name;
  const uniqueNumber = generateUniqueNumber();

  queue.push({ uniqueNumber, patientName });

  res.send(`Registered successfully! Your unique number is: ${uniqueNumber}`);
});

app.get('/queue', (req, res) => {
  res.json(queue);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
