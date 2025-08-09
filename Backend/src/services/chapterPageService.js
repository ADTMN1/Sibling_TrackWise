const ChapterPage = require("../models/chapterPage");

class ChapterPageService {
  // Create a new page
  async createPage({ chapterId, pageNumber, title, content }) {
    if (!chapterId || !pageNumber || !title || !content) {
      throw new Error("Missing required fields");
    }

    // Optional: Check if a page with same chapter & pageNumber already exists
    const existingPage = await ChapterPage.findOne({
      chapter: chapterId,
      pageNumber,
    });
    if (existingPage) {
      throw new Error("Page already exists");
    }

    const newPage = new ChapterPage({
      chapter: chapterId,
      pageNumber,
      title,
      content,
    });

    return await newPage.save();
  }

  // Get a single page by chapter and pageNumber
  async getPage(chapterId, pageNumber) {
    const page = await ChapterPage.findOne({ chapter: chapterId, pageNumber });
    if (!page) {
      throw new Error("Page not found");
    }
    return page;
  }

  // Optional: get all pages for a chapter
  async getPagesByChapter(chapterId) {
    return await ChapterPage.find({ chapter: chapterId }).sort("pageNumber");
  }
}

module.exports = new ChapterPageService();
