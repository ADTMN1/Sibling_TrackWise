const mongoose = require("mongoose");
const {
  allTest,
  getQuize,
  childScore,
  createTestService,
  createQuizService,
  createExamService,
  getExam,
  createScoreService,
  createOptionService,
  getOptionsByQuestion,
} = require("../services/questionService");
const getTest = async (req, res) => {
  // Logic to get all tests by ID
  try {

    const {grade}=req.params
    const AllTest = await allTest(grade); 
    if (!AllTest || AllTest.length === 0) {
      return res.status(404).json({ message: "No tests found for the specified grade" });
    }
    res.status(200).json(AllTest);
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllQuizs = async (req, res) => {
  try {
    const {grade} = req.params
    const quizs = await getQuize(grade);
    if (!quizs || quizs.length === 0) {
      return res.status(404).json({ message: "No quizzes found for the specified grade" });
    }
    return res.status(200).json(quizs);
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllExam = async (req,res) => {
  try {
    const {grade} = req.params;
    const exams = await getExam(grade);
    if (!exams || exams.length === 0) {
      return res.status(404).json({ message: "No exams found for the specified grade" });
    }
    return res.status(200).json(exams);

  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getScore = async(req, res) => {
  try {
    const { id } = req.params;
    
    console.log(id);    
   
    const score = await childScore(id);
   
    return res.status(200).json({ success: true, data: score });
  } catch (error) {
    console.error("Error fetching score:", error);
    res.status(500).json({ message: "Server error" });
    
  }
};



//  TEST 
const createTest = async (req, res) => {
  try {
    data = req.body;
    const test = await createTestService(data);
    if (!test) {
      return res
        .status(400)
        .json({ success: false, message: "Fail to create Test." });
    }
    res.status(201).json({ success: true, data: test, message: "Test created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// QUIZ 
const createQuiz = async (req, res) => {
  try {

    const data = req.body;

    const quiz = await createQuizService(data);
    if (!quiz) {
      return res
        .status(400)
        .json({ success: false, message: "Fail to create Quiz." });
    }

    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  EXAM 
const createExam = async (req, res) => {
  try {
   const data = req.body;
    const exam = await createExamService(data);
    if (!exam) {
      return res
        .status(400)
        .json({ success: false, message: "Fail to create Exam." });
    }
    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//  SCORE 
const createScore = async (req, res) => {
  try {
    const data= req.body;
    const score = await createScoreService(data);
    if (!score) { 
      return res
        .status(400)
        .json({ success: false, message: "Fail to create Score." });
    }

    res.status(201).json({ success: true, data: score });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};


const createOption = async (req, res) => {
  try {
    const data = req.body;

    const option = await createOptionService(data);
    if (!option) {
      return new Error("Fail to ceate options");
    }
    res.status(201).json(option);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};




const getOptions = async (req, res) => {
  try {
    const { question_type, question_id } = req.params;

    const options = await getOptionsByQuestion(
      question_id,
      question_type
    );

    if (!options.length) {
      return res
        .status(404)
        .json({ message: "No options found for this question." });
    }

    res.json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTest,
  getAllQuizs,
  getAllExam,
  getScore,
  createTest,
  createQuiz,
  createExam,
  createScore,
  createOption,
  getOptions,
};
