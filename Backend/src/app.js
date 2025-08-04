const express = require("express");
require("dotenv").config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Sibling TrackWise Backend!");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
