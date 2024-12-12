const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Sample routes
app.get('/', (req, res) => {
  res.send('Welcome to the Health Records App!');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Placeholder logic for authentication
  if (username && password) {
    // In a real application, you would verify the username and password against a database
    res.json({ role: 'user', token: 'fake-token' });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
