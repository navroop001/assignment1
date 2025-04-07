const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const corsOptions = {
  origin: '*',
  methods: 'GET,POST',
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
// GET /users
app.get('/users', (req, res) => {
  fs.readFile('users.json', (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    try {
      const users = JSON.parse(data);
      res.json(users);
    } catch (e) {
      res.status(500).send("Invalid JSON format in file");
    }
  });
});
// POST /users
app.post('/users', (req, res) => {
  const newUser = req.body;
  fs.readFile('users.json', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    let users = [];
    try {
      if (data.length > 0) {
        users = JSON.parse(data);
      }
    } catch (e) {
      return res.status(500).send("Invalid JSON format in file");
    }
    users.push(newUser);
    fs.writeFile('users.json', JSON.stringify(users, null, 2), err => {
      if (err) return res.status(500).send('Error writing file');
      res.json({
        message: 'User added successfully',
        user: newUser
      });
    });
  });
});
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
