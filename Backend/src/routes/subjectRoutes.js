const express = require("express");
const router = express.Router();

const subjectController = require("../controllers/subjectController");

// Get all subjects (public or protected)
router.get("/", subjectController.getAllSubjects);

// Get subject by ID
router.get("/:id", subjectController.getSubjectById);

module.exports = router;
