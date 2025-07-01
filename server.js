const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// 🔹 Submit request
app.post("/submit-request", (req, res) => {
  const requestData = req.body;
  const filePath = path.join(__dirname, "data", "requests.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    const requests = data ? JSON.parse(data) : [];
    requests.push(requestData);

    fs.writeFile(filePath, JSON.stringify(requests, null, 2), err => {
      if (err) {
        res.status(500).json({ message: "Failed to save request." });
      } else {
        res.status(200).json({ message: "Request saved successfully." });
      }
    });
  });
});

// 🔹 Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});