const express = require("express");
require("dotenv").config();
const connectDB = require("../src/config/db.js");
const router = require("./index.js");

const userRoutes = require("./routes/UserRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();
//Current IP Address (102.208.97.219/32) added!
app.use(express.json());

app.use("/api", router);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Sibling TrackWise Backend!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
