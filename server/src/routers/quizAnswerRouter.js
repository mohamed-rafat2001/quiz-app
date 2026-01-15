import express from "express";
import {
	quesAnswer,
	studentquizAnswers,
	getTeacherQuizAnswers,
	getQuizAnswer,
	getResultDetails,
} from "../controllers/quizAnswerControll.js";
import { allowTo, protect } from "../middelwars/authMiddelwar.js";
import { quizAnswerValidator } from "../utils/validators/quizAnswerValidator.js";

const quizAnswerRouter = express.Router();
quizAnswerRouter.get(
	"/teacher-quiz-answers/:id",
	protect,
	allowTo("teacher"),
	getTeacherQuizAnswers
);
quizAnswerRouter.get("/quiz-answer/:id", protect, getQuizAnswer);
quizAnswerRouter.get("/result-details/:id", protect, getResultDetails);
quizAnswerRouter.use(protect, allowTo("student"));
quizAnswerRouter.post("/answer/:id", quizAnswerValidator, quesAnswer);

quizAnswerRouter.get("/student-quiz-answers", studentquizAnswers);
export default quizAnswerRouter;
