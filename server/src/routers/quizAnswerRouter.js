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
	"/teacherQuizAnswers/:id",
	protect,
	allowTo("teacher"),
	getTeacherQuizAnswers
);
quizAnswerRouter.get("/quizAnswer/:id", protect, getQuizAnswer);
quizAnswerRouter.get("/resultDetails/:id", protect, getResultDetails);
quizAnswerRouter.use(protect, allowTo("student"));
quizAnswerRouter.post("/answer/:id", quizAnswerValidator, quesAnswer);

quizAnswerRouter.get("/studentquizAnswers", studentquizAnswers);
export default quizAnswerRouter;
