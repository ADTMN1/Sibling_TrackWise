const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  chapterProgress: [
    {
      chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
        required: true,
      },
      pagesRead: { type: Number, default: 0 },
      totalPages: { type: Number, required: true },
    },
  ],
  lastUpdated: { type: Date, default: Date.now },
});

progressSchema.index({ userId: 1, subjectId: 1 }, { unique: true });

progressSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model("Progress", progressSchema);
