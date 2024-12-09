const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample routes
app.get('/', (req, res) => {
  res.send('Welcome to the Health Records App!');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Placeholder logic for authentication
  if (username === 'doctor' && password === 'password') {
    res.json({ role: 'doctor', token: 'fake-doctor-token' });
  } else if (username === 'patient' && password === 'password') {
    res.json({ role: 'patient', token: 'fake-patient-token' });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
