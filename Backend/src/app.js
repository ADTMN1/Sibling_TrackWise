const express = require("express");
require("dotenv").config();
const connectDB = require("../src/config/db.js");

const userRoutes = require("./routes/userRoutes");

const app = express();

connectDB();

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Sibling TrackWise Backend!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
