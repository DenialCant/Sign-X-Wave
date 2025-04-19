const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "signup",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// Signup Endpoint
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error("❌ Signup error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Signup successful!" });
  });
});

// Login Endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log("📥 Login attempt:", email, password);

  const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("❌ Login error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      console.log("✅ Login successful for:", email);
      res.json({ success: true, message: "Login successful!" });
    } else {
      console.log("❌ Invalid login for:", email);
      res.json({ success: false, message: "Invalid credentials" });
    }
  });
});


app.listen(8081, () => {
  console.log("🚀 Server running on http://localhost:8081");
});