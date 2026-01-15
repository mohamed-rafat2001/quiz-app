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
	.route("/quiz/:id")
	.get(getQuizValidator, getQuiz)
	.delete(allowTo("teacher"), deleteQuiz)
	.patch(allowTo("teacher"), updateQuiz);
quizRouter
	.route("/quiz")
	.post(allowTo("teacher"), createQuizValidator, createQuiz);
quizRouter.post("/startQuiz", allowTo("student"), getQuizByPass);

quizRouter.route("/quiz/all").get(allQuizs);

// protect all routes after this middelware
quizRouter.use(protect, allowTo("teacher"));
//routes
quizRouter.route("/quiz/all").delete(deleteQuizs);
quizRouter.route("/quiz/question/:id").delete(deleteQues).patch(addQues);

// Admin routes
quizRouter.get("/admin/all", allowTo("admin"), allQuizzesByAdmin);
quizRouter.delete("/admin/:id", allowTo("admin"), deleteQuizByAdmin);

export default quizRouter;
