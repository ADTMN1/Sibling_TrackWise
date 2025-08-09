const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");

router.post("/update", progressController.updateChapterProgress);
router.get("/:userId/:subjectId", progressController.getUserProgress);

module.exports = router;
