const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve working.html
app.get('/working.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'working.html'));
});

// Submit service request
app.post('/request-service', (req, res) => {
  const newRequest = req.body;
  const filePath = path.join(__dirname, 'data', 'requests.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    let requests = [];
    if (!err && data) {
      requests = JSON.parse(data);
    }

    requests.push(newRequest);

    fs.writeFile(filePath, JSON.stringify(requests, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save request' });
      }

      // Matching mechanics
      const mechanicsPath = path.join(__dirname, 'data', 'mechanics.json');
      fs.readFile(mechanicsPath, 'utf8', (err, mechanicsData) => {
        if (err) {
          console.error('Error reading mechanics.json');
          return res.json({ message: 'Request submitted, but matching failed' });
        }

        const mechanics = JSON.parse(mechanicsData);
        const matched = mechanics.filter(m =>
          m.pincode === newRequest.pincode && m.type === newRequest.service
        );

        console.log(`Matching Mechanics for ${newRequest.name}:`);
        matched.forEach(m => {
          console.log(`📞 ${m.name} (${m.type}) - ${m.phone}`);
        });

        res.json({ message: 'Request submitted successfully', matched });
      });
    });
  });
});

// Get all service requests
app.get('/get-requests', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'requests.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read requests' });
    }
    const requests = JSON.parse(data || '[]');
    res.json(requests);
  });
});

// ✅ Add Mechanic Route
app.post('/add-mechanic', (req, res) => {
  const newMechanic = req.body;
  const mechanicsPath = path.join(__dirname, 'data', 'mechanics.json');

  fs.readFile(mechanicsPath, 'utf8', (err, data) => {
    let mechanics = [];
    if (!err && data) {
      mechanics = JSON.parse(data);
    }

    mechanics.push(newMechanic);

    fs.writeFile(mechanicsPath, JSON.stringify(mechanics, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ success: false });
      }
      res.json({ success: true });
    });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});