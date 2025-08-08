
const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  child_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Child",
    required: true,
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subject",
    default: null,
  },
  content: {
    type: String,
    required: true,
  },
  score_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Score",
    default: null,
  },
  grade: {
    type: String,
    required: true,
  },
});

const quizSchema = new mongoose.Schema({
  child_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Child",
    required: true,
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subject",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  score_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Score",
    default: null,
  },
  grade: {
    type: String,
    required: true,
  },
});


//Exam schema

const examSchema = new mongoose.Schema({
  child_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Child",
    required: true,
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subject",
    required: true,
  },
  // score: {
  //   type: String,
  //   required: true,
  // },
  score_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Score",
    default: null,
  },
  grade: {
    type: String,
    required: true,
  }
});

//SCORE SCHEMA
const ScoreSchema = new mongoose.Schema({
  test_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test", // reference to User collection
    default: null, // reference to Test collection
  },
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    default: null, // reference to Test collection
  },
  exam_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    default: null,
  },
  score_value: {
    type: Number,
    required: true,
    default: 0, // default score value
  },
  grade: {
    type: String,
    required: true,
  },
});

const optionSchema = new mongoose.Schema({
  question_type: {
    type: String,
    enum: ["Test", "Quiz", "Exam"],
    required: true,
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  option_text: {
    type: [String], 
   
    required: true,
  },
  correct_index: {
    type: Number, 
    required: true,
  },
});

module.exports = mongoose.model("Option", optionSchema);


module.exports = {
  Test: mongoose.model("Test", testSchema),
  Quiz: mongoose.model("Quiz", quizSchema),
  Exam: mongoose.model("Exam", examSchema),
  Score: mongoose.model("Score", ScoreSchema),
  Option: mongoose.model("Option", optionSchema),
};