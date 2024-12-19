const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Sample routes
app.get('/', (req, res) => {
  res.send('Welcome to the Health Records App!');
});

app.post('/login', (req, res) => {
  const { username, password, userType } = req.body;

  // Placeholder logic for authentication
  if (username && password) {
    // In a real application, you would verify the username and password against a database
    res.json({ role: userType, token: 'fake-token' });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// New endpoint to fetch the first patient data
app.get('/patient', (req, res) => {
  const query = 'SELECT * FROM Patient LIMIT 1';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching patient data:', err);
      res.status(500).send('Error fetching patient data');
      return;
    }
    console.log('Fetched patient data:', results[0]); // Add this line to log the fetched data
    res.json(results[0]);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
