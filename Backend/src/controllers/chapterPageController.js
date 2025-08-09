const chapterPageService = require("../services/chapterPageService");

exports.createPage = async (req, res) => {
  try {
    const createdPage = await chapterPageService.createPage(req.body);
    res.status(201).json(createdPage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPage = async (req, res) => {
  try {
    const page = await chapterPageService.getPage(
      req.params.chapterId,
      req.params.pageNumber
    );
    res.json(page);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.getPagesByChapter = async (req, res) => {
  try {
    const pages = await chapterPageService.getPagesByChapter(
      req.params.chapterId
    );
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
