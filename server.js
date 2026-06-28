const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "leads.json";

function loadLeads() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function saveLeads(leads) {
  fs.writeFileSync(DB_FILE, JSON.stringify(leads, null, 2));
}

// 🧠 SIMPLE AI SCORING ENGINE
function scoreLead(lead) {
  let score = 0;

  const text = (lead.title + " " + (lead.emails || []).join(" ")).toLowerCase();

  // email present
  if (lead.emails?.length) score += 30;

  // phone present
  if (lead.phones?.length) score += 20;

  // business signals
  if (text.includes("contact")) score += 10;
  if (text.includes("services")) score += 10;
  if (text.includes("pricing")) score += 15;
  if (text.includes("book")) score += 15;

  // weak signal
  if (text.includes("home") || text.includes("welcome")) score += 5;

  if (score >= 60) return "HOT";
  if (score >= 30) return "WARM";
  return "COLD";
}

// POST lead
app.post("/lead", (req, res) => {
  const leads = loadLeads();

  const newLead = {
    ...req.body,
    id: Date.now(),
    score: scoreLead(req.body)
  };

  const exists = leads.find(l => l.url === newLead.url);
  if (!exists) {
    leads.push(newLead);
    saveLeads(leads);
  }

  res.json({ status: "ok" });
});

// GET leads
app.get("/leads", (req, res) => {
  res.json(loadLeads());
});

// GET dashboard stats
app.get("/stats", (req, res) => {
  const leads = loadLeads();

  res.json({
    total: leads.length,
    hot: leads.filter(l => l.score === "HOT").length,
    warm: leads.filter(l => l.score === "WARM").length,
    cold: leads.filter(l => l.score === "COLD").length
  });
});

app.listen(3000, () => {
  console.log("Lead SaaS running on http://localhost:3000");
});
