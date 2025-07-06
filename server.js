const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// POST: /request-service
app.post('/request-service', (req, res) => {
  const { name, phone, pincode, service } = req.body;

  if (!name || !phone || !pincode || !service) {
    return res.status(400).json({ message: '❌ All fields are required.' });
  }

  const newRequest = {
    name,
    phone,
    pincode,
    service,
    timestamp: new Date().toISOString()
  };

  const requestFile = path.join(__dirname, 'data', 'requests.json');
  const mechanicFile = path.join(__dirname, 'data', 'mechanics.json');

  // Read requests.json
  fs.readFile(requestFile, 'utf8', (err, requestData) => {
    let requests = [];
    if (!err && requestData) {
      try {
        requests = JSON.parse(requestData);
      } catch (e) {
        requests = [];
      }
    }

    requests.push(newRequest);

    // Save to requests.json
    fs.writeFile(requestFile, JSON.stringify(requests, null, 2), (err) => {
      if (err) {
        console.error('❌ Failed to save request');
        return res.status(500).json({ message: '❌ Internal server error' });
      }

      // Match mechanic
      fs.readFile(mechanicFile, 'utf8', (err, mechanicData) => {
        let mechanics = [];
        if (!err && mechanicData) {
          try {
            mechanics = JSON.parse(mechanicData);
          } catch (e) {
            mechanics = [];
          }
        }

        const matched = mechanics.filter(m => m.pincode === pincode && m.type === service);
        console.log('✅ New request received:', newRequest);
        console.log('🔍 Matched mechanics:', matched);

        return res.json({
          message: 'Request submitted successfully!',
          matchedMechanics: matched
        });
      });
    });
  });
});

// GET /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});