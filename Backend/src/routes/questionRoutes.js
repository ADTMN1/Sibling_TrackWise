const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
//TEST ROUTES
// router.post("/test", questionController.createTest);
router.get("/tests/:grade", questionController.getTest);


// QUIZ ROUTES

router.get("/quizs/:grade", questionController.getAllQuizs);


//EXAM ROUTES
router.get("/exams/:grade", questionController.getAllExam);
router.get("/score/:id", questionController.getScore);

//SCORE ROUTES
// router.post("/score", questionController.Score);
// router.get("/score/id", questionController.getScore);
router.post("/tests", questionController.createTest);
router.post("/quizzes", questionController.createQuiz);
router.post("/exams", questionController.createExam);
router.post("/scores", questionController.createScore);


// Option

router.post("/create_option", questionController.createOption);
router.get(
  "/get_option/:question_type/:question_id",
  questionController.getOptions
);
module.exports = router;