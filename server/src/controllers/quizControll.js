import mongoose from "mongoose";
import quizModel from "../models/quizModel.js";
import quizQuestionModel from "../models/quizQuestionModel.js";
import quizResultModel from "../models/quizResultModel.js";

import errorHandling from "../middelwars/errorHandling.js";
import appError from "../utils/appError.js";
import uniqid from "uniqid";
import response from "../utils/handelResponse.js";
import * as factory from "../utils/handlerFactory.js";

// create quiz
export const createQuiz = errorHandling(async (req, res, next) => {
	const teacherId = req.user._id;
	const quizId = uniqid();
	let { questions, expire, quizName } = req.body;

	if (!questions || (Array.isArray(questions) && questions.length === 0))
		return next(new appError("please enter the question", 400));

	// create quiz first
	const quiz = await quizModel.create({
		quizName,
		teacherId,
		questions: [],
		quizPassword: Date.now() + Math.floor(Math.random() * 1000),
		quizId,
		expire,
	});

	if (!quiz) return next(new appError("quiz not created", 400));

	// create questions and link to quiz
	const questionDocs = Array.isArray(questions) ? questions : [questions];
	const createdQuestions = await Promise.all(
		questionDocs.map((q) =>
			quizQuestionModel.create({
				...q,
				quizId: quiz._id,
			})
		)
	);

	quiz.questions = createdQuestions.map((q) => q._id);
	await quiz.save();

	response(quiz, 201, res);
});
// delete quiz
export const deleteQuiz = factory.deleteOneOwner(quizModel, "teacherId");

// get quiz by params
export const getQuiz = factory.getOne(quizModel, { path: "questions" });
//get quiz by password
export const getQuizByPass = errorHandling(async (req, res, next) => {
	const { quizPassword, quizId } = req.body;
	if (!quizPassword || !quizId)
		return next(new appError("please enter the password and Id", 400));
	const quiz = await quizModel
		.findOne({
			quizId,
			quizPassword,
			expireDate: { $gt: Date.now() },
		})
		.populate("questions");
	if (!quiz) return next(new appError("quiz not found", 404));
	response(quiz, 200, res);
});
// get all quizs
export const allQuizs = errorHandling(async (req, res, next) => {
	let query;
	if (req.user.role === "teacher") {
		query = quizModel.find({ teacherId: req.user._id });
	} else if (req.user.role === "student") {
		// Students only see non-expired quizzes
		query = quizModel.find({ expireDate: { $gt: Date.now() } });
	} else {
		// Admins see all
		query = quizModel.find();
	}

	const quizzes = await query.populate("teacherId", "name email");
	response(quizzes, 200, res);
});
// admin get all quizs
export const allQuizzesByAdmin = factory.getAll(quizModel);
// admin delete quiz
export const deleteQuizByAdmin = factory.deleteOne(quizModel);
// delete all quizs
export const deleteQuizs = errorHandling(async (req, res, next) => {
	const teacherId = req.user._id;

	// Find all quizzes by this teacher
	const quizzes = await quizModel.find({ teacherId });
	const quizIds = quizzes.map((q) => q._id);

	if (quizIds.length > 0) {
		// Delete all related data in bulk
		await Promise.all([
			quizModel.deleteMany({ _id: { $in: quizIds } }),
			quizQuestionModel.deleteMany({ quizId: { $in: quizIds } }),
			quizResultModel.deleteMany({ quizId: { $in: quizIds } }),
			// Import questionAnswerModel if needed, or use its name
			mongoose
				.model("QuestionAnswerModel")
				.deleteMany({ quizId: { $in: quizIds } }),
		]);
	}

	response(null, 204, res);
});
// update quiz
export const updateQuiz = factory.updateOneOwner(quizModel, "teacherId");

// delete question
export const deleteQues = errorHandling(async (req, res, next) => {
	const { _id } = req.body; // question ID

	const quiz = await quizModel.findOne({
		_id: req.params.id,
		teacherId: req.user._id,
	});

	if (!quiz) return next(new appError("quiz not found", 404));

	// Delete question from QuizQuestionModel
	await quizQuestionModel.findByIdAndDelete(_id);

	// Remove ID from quiz.questions
	quiz.questions = quiz.questions.filter((q) => q.toString() !== _id);

	await quiz.save();
	response(quiz, 200, res);
});
// add ques
export const addQues = errorHandling(async (req, res, next) => {
	const { questions } = req.body; // single question object
	const quiz = await quizModel.findOne({
		_id: req.params.id,
		teacherId: req.user._id,
	});

	if (!quiz) return next(new appError("quiz not found", 404));

	// Create new QuizQuestion
	const newQuestion = await quizQuestionModel.create({
		...questions,
		quizId: quiz._id,
	});

	quiz.questions.push(newQuestion._id);

	await quiz.save();
	response(quiz, 200, res);
});
