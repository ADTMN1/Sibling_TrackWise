// const { Error } = require("mongoose");
// const { Score } = require("../models/questionModels");
const { Test, Quiz, Exam, Score, Option } = require("../models/questionModels"); // adjust path

const allTest = async(grade) => {
if (!grade) {
    throw new Error("Grade is required");
  }

  const Tests = await Test.find({ grade })
  if (!Tests || Tests.length === 0) {
    throw new Error("No tests found for the specified grade");
  }
  return Tests;

}

const getQuize = async (grade) => {

  if (!grade) {
    throw new Error("Grade is required");
  }
const quizzes = await Quiz.find({ grade });
if (!quizzes || quizzes.length === 0) {
    throw new Error( "No quizzes found for the specified grade");
  }
  return quizzes;
}

const getExam = async (grade) => {
  if (!grade) {
    return "Grade is required";
  }
  const exams = await Exam.find({ grade });
  if (!exams || exams.length === 0) {
    throw new Error ("No exams found for the specified grade");
  }
  return exams;
}





const childScore = async (id) => {
  if (!id) {
    throw new Error("Child is required");
  }
  const user = await Score.findById(id)
    .populate("test_id")
    .populate("quiz_id")
    .populate("exam_id");
  if (!user) {
    return new Error("user not found.");
 
  }
  const score = await Score.find({ user });
  if (!score || score.length === 0) {
    throw new Error("No score found for the specified user");
  }
  return score;
};

const createTestService = async (data) => {
  const { child_id, subject_id, content, score_id, grade } = data;
  if (!child_id || !subject_id || !content || !grade) {
    throw new Error("Missing required fields");
  }
  const test = await Test.create({
    child_id,
    subject_id,
    content,
    score_id,
    grade,
  });
  return test;

}
 
const createQuizService = async (data) => {
  const { child_id, subject_id, content, score_id, grade } = data;
  if (!child_id || !subject_id || !content || !grade) {
    throw new Error("Missing required fields");
  }
  const quiz = await Quiz.create({
    child_id,
    subject_id,
    content,
    score_id,
    grade,
  });
  return quiz;
}

const createExamService = async (data) => {
  const { child_id, subject_id, content, score_id, grade } = data;
  if (!child_id || !subject_id || !content || !grade) {
    throw new Error("Missing required fields");
  }
  const exam = await Exam.create({
    child_id,
    subject_id,
    content,
    score_id,
    grade,
  });
  return exam;
}
const createScoreService = async (data) => {
  const { test_id, quiz_id, exam_id, score } = data;
  if (!test_id && !quiz_id && !exam_id || !score) {
    throw new Error("At least one of test_id, quiz_id, or exam_id is required");
  }
  const scoreData = await Score.create({
    test_id,
    quiz_id,
    exam_id,
    score,
  });
  return scoreData;
}



// Create new options for a question
const createOptionService = (data) => {
  const { question_type, question_id, option_text, correct_index } = data;
  if (
    !question_type ||
    !question_id ||
    !option_text ||
    correct_index === undefined
  ) {
    throw new Error("All fields are required");
  }
  if (!Array.isArray(option_text) || option_text.length < 2) {
    return res
      .status(400)
      .json({ message: "At least two options are required." });
  }

  if (correct_index < 0 || correct_index >= option_text.length) {
    return res.status(400).json({ message: "Invalid correct_index value." });
  }

  const option = new Option({
    question_type,
    question_id,
    option_text,
    correct_index,
  }).save();
  return option;
};

// Get all options for a specific question
const getOptionsByQuestion= async(question_id, question_type)=> {
  if (!question_id || !question_type) {
    throw new Error("Question and type are required");
  }
  const option = await Option.find({ question_id, question_type });

  if (!option || option.length === 0) {
    throw new Error("No options found for the specified question");
  }
  return option;
}








module.exports = {
  allTest,
  getQuize,
  getExam,
  childScore,
  createTestService,
  createQuizService,
  createExamService,
  createScoreService,
  createOptionService,
  getOptionsByQuestion,
};