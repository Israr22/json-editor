// index.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

const sampleFilePath = path.join(__dirname, "sample.json");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("views"));

// Serve Home Page with Edit JSON button
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

// Show editable JSON in textarea
app.get("/edit-json", (req, res) => {
  const sampleData = fs.readFileSync(sampleFilePath, "utf-8");
  const html = `
    <html>
    <head><title>Edit JSON</title></head>
    <body>
      <h2>Edit sample.json</h2>
      <form method="POST" action="/update-json">
        <textarea name="jsonData" rows="20" cols="100">${sampleData}</textarea>
        <br/><br/>
        <button type="submit">Save</button>
      </form>
      <br/>
      <a href="/">← Back to Home</a>
    </body>
    </html>
  `;
  res.send(html);
});

// Save updated JSON
app.post("/update-json", (req, res) => {
  try {
    const json = JSON.parse(req.body.jsonData); // Validate JSON
    fs.writeFileSync(sampleFilePath, JSON.stringify(json, null, 2));
    res.send(`
      <h3>✅ JSON updated successfully!</h3>
      <a href="/">← Back to Home</a>
    `);
  } catch (err) {
    res.send(`
      <h3>❌ Invalid JSON format!</h3>
      <a href="/edit-json">← Try Again</a>
    `);
  }
});

// API to return filtered data by query param
app.get("/get-data", (req, res) => {
  const { type } = req.query;
  const jsonData = JSON.parse(fs.readFileSync(sampleFilePath, "utf-8"));
  const result = jsonData[type];
  res.send(result || {});
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
