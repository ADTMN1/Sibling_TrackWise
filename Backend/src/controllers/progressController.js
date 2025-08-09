const progressService = require("../services/progressService");

const updateChapterProgress = async (req, res) => {
  const { userId, subjectId, chapterId } = req.body;

  if (!userId || !subjectId || !chapterId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updatedProgress = await progressService.updateProgress(
      userId,
      subjectId,
      chapterId
    );
    res.json(updatedProgress);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating progress", error: err.message });
  }
};

const getUserProgress = async (req, res) => {
  const { userId, subjectId } = req.params;

  try {
    const progress = await progressService.getProgress(userId, subjectId);
    res.json(progress);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching progress", error: err.message });
  }
};

module.exports = {
  updateChapterProgress,
  getUserProgress,
};
