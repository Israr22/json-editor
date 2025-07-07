const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const sampleFilePath = path.join(__dirname, "../sample.json");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../views")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/home.html"));
});

app.get("/edit-json", (req, res) => {
  const data = fs.readFileSync(sampleFilePath, "utf-8");
  res.send(`
    <h2>Edit sample.json</h2>
    <form method="POST" action="/update-json">
      <textarea name="jsonData" rows="20" cols="100">${data}</textarea>
      <br/><br/>
      <button type="submit">Save</button>
    </form>
    <br/>
    <a href="/">Back to Home</a>
  `);
});

app.post("/update-json", (req, res) => {
  try {
    const parsed = JSON.parse(req.body.jsonData);
    fs.writeFileSync(sampleFilePath, JSON.stringify(parsed, null, 2));
    res.send("✅ JSON updated successfully!<br><a href='/'>Back to Home</a>");
  } catch (error) {
    res.send("❌ Invalid JSON format!<br><a href='/edit-json'>Try again</a>");
  }
});

app.get("/get-data", (req, res) => {
  const query = req.query;
  const data = JSON.parse(fs.readFileSync(sampleFilePath));
  const result = data[query.type];
  res.send(result || {});
});

// Export as handler for serverless
module.exports = app;
