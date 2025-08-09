const Progress = require("../models/progressModel");

const updateProgress = async (userId, subjectId, chapterId, pagesRead = 1) => {
  const progress = await Progress.findOne({ userId, subjectId });

  if (!progress) {
    const newProgress = new Progress({
      userId,
      subjectId,
      chapterProgress: [
        {
          chapterId,
          pagesRead,
          totalPages: pagesRead,
        },
      ],
    });
    return await newProgress.save();
  }

  const chapterIndex = progress.chapterProgress.findIndex((c) =>
    c.chapterId.equals(chapterId)
  );

  if (chapterIndex > -1) {
    progress.chapterProgress[chapterIndex].pagesRead = Math.min(
      progress.chapterProgress[chapterIndex].pagesRead + pagesRead,
      progress.chapterProgress[chapterIndex].totalPages
    );
  } else {
    progress.chapterProgress.push({
      chapterId,
      pagesRead,
      totalPages: pagesRead,
    });
  }

  return await progress.save();
};

const getProgress = async (userId, subjectId) => {
  return await Progress.findOne({ userId, subjectId }).populate(
    "chapterProgress.chapterId"
  );
};

module.exports = {
  updateProgress,
  getProgress,
};
