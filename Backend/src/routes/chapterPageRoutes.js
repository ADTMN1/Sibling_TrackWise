const express = require("express");
const router = express.Router();
const chapterPageController = require("../controllers/chapterPageController");

// Create page
router.post("/", chapterPageController.createPage);

// Get single page
router.get("/:chapterId/:pageNumber", chapterPageController.getPage);

// Optional: get all pages for a chapter
router.get("/all/:chapterId", chapterPageController.getPagesByChapter);

module.exports = router;
