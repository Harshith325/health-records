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
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'HMS',
  port: process.env.DB_PORT || 3306
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

app.get('/appointments', (req, res) => {
  const { P_Em_Id, D_Em_Id } = req.query;
  let query;
  let params;

  if (P_Em_Id) {
    query = 'SELECT * FROM appointment WHERE P_Em_Id = ?';
    params = [P_Em_Id];
  } else if (D_Em_Id) {
    query = 'SELECT * FROM appointment WHERE D_Em_Id = ?';
    params = [D_Em_Id];
  } else {
    query = 'SELECT * FROM appointment';
    params = [];
  }

  console.log('Executing query:', query, 'with params:', params);
  
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send('Error fetching appointments');
      return;
    }
    console.log('Query results:', results);
    res.json(results);
  });
});

// New endpoint to insert patient data
app.post('/patient', (req, res) => {
  const { P_Em_Id, Name, DOB } = req.body;
  const query = 'INSERT INTO Patient (P_Em_Id, Name, DOB) VALUES (?, ?, ?)';

  db.query(query, [P_Em_Id, Name, DOB], (err, results) => {
    if (err) {
      console.error('Error inserting patient data:', err);
      res.status(500).send('Error inserting patient data');
      return;
    }
    res.status(201).send('Patient data inserted successfully');
  });
});

// New endpoint to insert doctor data
app.post('/doctor', (req, res) => {
  const { D_Em_Id, Name, Specialty } = req.body;
  const query = 'INSERT INTO Doctor (D_Em_Id, Name, Specialty) VALUES (?, ?, ?)';

  db.query(query, [D_Em_Id, Name, Specialty], (err, results) => {
    if (err) {
      console.error('Error inserting doctor data:', err);
      res.status(500).send('Error inserting doctor data');
      return;
    }
    res.status(201).send('Doctor data inserted successfully');
  });
});

// New endpoint to fetch doctor data
app.get('/doctor', (req, res) => {
  const { D_Em_Id } = req.query;
  const query = 'SELECT * FROM Doctor WHERE D_Em_Id = ?';

  db.query(query, [D_Em_Id], (err, results) => {
    if (err) {
      console.error('Error fetching doctor data:', err);
      res.status(500).send('Error fetching doctor data');
      return;
    }
    res.json(results[0]);
  });
});

// New endpoint to fetch all doctors
app.get('/doctors', (req, res) => {
  const query = 'SELECT D_Em_Id, Name, Specialty FROM Doctor';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching doctors:', err);
      res.status(500).send('Error fetching doctors');
      return;
    }
    res.json(results);
  });
});

// New endpoint to fetch all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT P_Em_Id, Name FROM Patient';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching patients:', err);
      res.status(500).send('Error fetching patients');
      return;
    }
    res.json(results);
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
