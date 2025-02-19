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

// Update patient GET endpoint
app.get('/patient', (req, res) => {
  const { P_Em_Id } = req.query;
  const query = 'SELECT * FROM Patient WHERE P_Em_Id = ?';
  const params = [P_Em_Id];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching patient data:', err);
      res.status(500).send('Error fetching patient data');
      return;
    }
    res.json(results[0] || null);
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
app.get('/prescriptions', (req, res) => {
  const { P_Em_Id, D_Em_Id } = req.query;
  let query;
  let params;

  if (P_Em_Id) {
    query = `
      SELECT p.*, GROUP_CONCAT(
        CONCAT(m.Name, ' (', m.Dosage, ' - ', m.Frequency, ')')
        SEPARATOR '; '
      ) as Medications
      FROM prescription p
      LEFT JOIN medication m ON p.Pre_ID = m.Pre_ID
      WHERE p.P_Em_Id = ?
      GROUP BY p.Pre_ID`;
    params = [P_Em_Id];
  } else if (D_Em_Id) {
    query = `
      SELECT p.*, GROUP_CONCAT(
        CONCAT(m.Name, ' (', m.Dosage, ' - ', m.Frequency, ')')
        SEPARATOR '; '
      ) as Medications
      FROM prescription p
      LEFT JOIN medication m ON p.Pre_ID = m.Pre_ID
      WHERE p.D_Em_Id = ?
      GROUP BY p.Pre_ID`;
    params = [D_Em_Id];
  } else {
    return res.status(400).send('Either P_Em_Id or D_Em_Id is required');
  }

  console.log('Executing prescription query:', query, 'with params:', params);
  
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send('Error fetching prescriptions');
      return;
    }
    console.log('Prescription results:', results);
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

// Add this new endpoint after other endpoints
app.get('/billing', (req, res) => {
  const { P_Em_Id } = req.query;
  const query = 'SELECT * FROM billing WHERE P_Em_Id = ?';
  const params = [P_Em_Id];

  console.log('Executing billing query:', query, 'with params:', params);
  
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send('Error fetching billing data');
      return;
    }
    console.log('Billing query results:', results);
    res.json(results);
  });
});

// POST endpoint for appointments
app.post('/appointments', (req, res) => {
  const { P_Em_Id, D_Em_Id, Date, Time } = req.body;
  const query = 'INSERT INTO appointment (P_Em_Id, D_Em_Id, Date, Time) VALUES (?, ?, ?, ?)';
  
  console.log('Creating appointment:', req.body);
  
  db.query(query, [P_Em_Id, D_Em_Id, Date, Time], (err, results) => {
    if (err) {
      console.error('Error creating appointment:', err);
      res.status(500).send('Error creating appointment');
      return;
    }
    res.status(201).json({ message: 'Appointment created successfully' });
  });
});

app.post('/prescriptions', async (req, res) => {
  const { P_Em_Id, D_Em_Id, Date, Notes, MedicineName, Dosage, Frequency, skipMedication } = req.body;
  
  // If skipMedication is true, only insert prescription
  if (skipMedication) {
    const query = 'INSERT INTO prescription (P_Em_Id, D_Em_Id, Date, Notes) VALUES (?, ?, ?, ?)';
    
    db.query(query, [P_Em_Id, D_Em_Id, Date, Notes], (err, results) => {
      if (err) {
        console.error('Error creating prescription:', err);
        res.status(500).send('Error creating prescription');
        return;
      }
      res.status(201).json({ message: 'Prescription created successfully' });
    });
    return;
  }

  // Otherwise, use transaction for prescription + medication
  db.beginTransaction(async (err) => {
    if (err) { 
      console.error('Error starting transaction:', err);
      return res.status(500).send('Error creating prescription');
    }

    try {
      // First insert prescription
      const prescriptionQuery = 'INSERT INTO prescription (P_Em_Id, D_Em_Id, Date, Notes) VALUES (?, ?, ?, ?)';
      db.query(prescriptionQuery, [P_Em_Id, D_Em_Id, Date, Notes], (err, prescResult) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error creating prescription:', err);
            res.status(500).send('Error creating prescription');
          });
        }

        // Get the inserted prescription ID
        const Pre_ID = prescResult.insertId;

        // Then insert medication if provided
        if (MedicineName && Dosage && Frequency) {
          const medicationQuery = 'INSERT INTO medication (Pre_ID, Name, Dosage, Frequency) VALUES (?, ?, ?, ?)';
          db.query(medicationQuery, [Pre_ID, MedicineName, Dosage, Frequency], (err) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error creating medication:', err);
                res.status(500).send('Error creating medication');
              });
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error('Error committing transaction:', err);
                  res.status(500).send('Error creating prescription and medication');
                });
              }
              res.status(201).json({ 
                message: 'Prescription and medication created successfully',
                Pre_ID: Pre_ID
              });
            });
          });
        } else {
          // If no medication details, just commit the prescription
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error committing transaction:', err);
                res.status(500).send('Error creating prescription');
              });
            }
            res.status(201).json({ 
              message: 'Prescription created successfully',
              Pre_ID: Pre_ID
            });
          });
        }
      });
    } catch (error) {
      db.rollback(() => {
        console.error('Error in transaction:', error);
        res.status(500).send('Error creating prescription and medication');
      });
    }
  });
});
// POST endpoint for billing
app.post('/billing', (req, res) => {
  const { P_Em_Id, Amount, Status, Date } = req.body;
  const query = 'INSERT INTO billing (P_Em_Id, Amount, Status, Date) VALUES (?, ?, ?, ?)';
  
  console.log('Creating billing:', req.body);
  
  db.query(query, [P_Em_Id, Amount, Status, Date], (err, results) => {
    if (err) {
      console.error('Error creating billing:', err);
      res.status(500).send('Error creating billing');
      return;
    }
    res.status(201).json({ message: 'Billing created successfully' });
  });
});

app.get('/generate-summary/:P_Em_Id', (req, res) => {
  const { P_Em_Id } = req.params;

  const query = `
    SELECT 
      p.Pre_ID,
      p.Date,
      p.Notes,
      GROUP_CONCAT(
        CONCAT(m.Name, ' (', m.Dosage, ' - ', m.Frequency, ')')
        SEPARATOR '; '
      ) as Medications
    FROM prescription p
    LEFT JOIN medication m ON p.Pre_ID = m.Pre_ID
    WHERE p.P_Em_Id = ?
    GROUP BY p.Pre_ID
    ORDER BY p.Date DESC
  `;

  db.query(query, [P_Em_Id], (err, results) => {
    if (err) {
      console.error('Error generating summary:', err);
      return res.status(500).send('Error generating summary');
    }

    let summary = `Medical Summary for Patient ID: ${P_Em_Id}\n\n`;
    results.forEach(record => {
      summary += `Date: ${new Date(record.Date).toLocaleDateString()}\n`;
      summary += `Notes: ${record.Notes}\n`;
      if (record.Medications) {
        summary += `Medications: ${record.Medications}\n`;
      }
      summary += '------------------------\n';
    });

    res.json({ summary });
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
