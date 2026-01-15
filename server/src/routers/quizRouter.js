import express from "express";
const quizRouter = express.Router();
import { allowTo, protect } from "../middelwars/authMiddelwar.js";
import {
	addQues,
	allQuizs,
	createQuiz,
	deleteQues,
	deleteQuiz,
	deleteQuizs,
	getQuiz,
	getQuizByPass,
	updateQuiz,
	allQuizzesByAdmin,
	deleteQuizByAdmin,
} from "../controllers/quizControll.js";
import {
	createQuizValidator,
	getQuizValidator,
} from "../utils/validators/quizValidator.js";

quizRouter.use(protect);
quizRouter
	.route("/quizzes/:id")
	.get(getQuizValidator, getQuiz)
	.delete(allowTo("teacher"), deleteQuiz)
	.patch(allowTo("teacher"), updateQuiz);
quizRouter
	.route("/quizzes")
	.post(allowTo("teacher"), createQuizValidator, createQuiz);
quizRouter.post("/start-quiz", allowTo("student"), getQuizByPass);

quizRouter
	.route("/all-quizzes")
	.get(allQuizs)
	.delete(protect, allowTo("teacher"), deleteQuizs);

quizRouter
	.route("/question/:id")
	.delete(protect, allowTo("teacher"), deleteQues)
	.patch(protect, allowTo("teacher"), addQues);

// Admin routes
quizRouter.get("/admin/all", allowTo("admin"), allQuizzesByAdmin);
quizRouter.delete("/admin/:id", allowTo("admin"), deleteQuizByAdmin);

export default quizRouter;
