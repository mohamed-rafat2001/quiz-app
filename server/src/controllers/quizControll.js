import mongoose from "mongoose";
import quizModel from "../models/quizModel.js";
import quizQuestionModel from "../models/quizQuestionModel.js";
import quizResultModel from "../models/quizResultModel.js";

import errorHandling from "../middelwars/errorHandling.js";
import appError from "../utils/appError.js";
import uniqid from "uniqid";
import response from "../utils/handelResponse.js";
import * as factory from "../utils/handlerFactory.js";
import ApiFeatures from "../utils/apiFeatures.js";

// create quiz
export const createQuiz = errorHandling(async (req, res, next) => {
	const teacherId = req.user._id;
	const quizId = uniqid();
	let { questions, expire, quizName, expireUnit, expireDate, startDate, tries } = req.body;

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
		expireUnit,
		expireDate,
		startDate: startDate || Date.now(),
		tries,
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

	// Update quiz with question IDs
	// We use findByIdAndUpdate to avoid overwriting quizScore which might have been updated by hooks
	const updatedQuiz = await quizModel.findByIdAndUpdate(
		quiz._id,
		{ questions: createdQuestions.map((q) => q._id) },
		{ new: true }
	);

	response(updatedQuiz, 201, res);
});
// delete quiz
export const deleteQuiz = factory.deleteOneOwner(quizModel, "teacherId");

// get quiz by params
export const getQuiz = errorHandling(async (req, res, next) => {
	const { id } = req.params;

	// Try finding by MongoDB _id first, then by custom quizId
	let quiz;
	const query = (q) =>
		q
			.populate("questions")
			.populate("firstInQuiz.studentId", "name email image")
			.populate("secondInQuiz.studentId", "name email image")
			.populate("thirdInQuiz.studentId", "name email image");

	if (mongoose.Types.ObjectId.isValid(id)) {
		quiz = await query(quizModel.findById(id));
	}

	if (!quiz) {
		quiz = await query(quizModel.findOne({ quizId: id }));
	}

	if (!quiz) return next(new appError("The requested quiz could not be found. Please check the ID.", 404));

	if (req.user.role === "student") {
		const now = new Date();
		if (now < new Date(quiz.startDate)) {
			return next(new appError(`This quiz has not started yet. It will be available on ${new Date(quiz.startDate).toLocaleString()}`, 400));
		}
		if (now > new Date(quiz.expireDate)) {
			return next(new appError("This quiz has already expired and is no longer available.", 400));
		}

		const results = await quizResultModel.find({
			studentId: req.user._id,
			quizId: quiz._id,
		});

		// Find the best result for this student on this specific quiz
		const bestResult = results.reduce((prev, current) => {
			return prev.totalScore > current.totalScore ? prev : current;
		}, results[0] || null);

		return response(
			{
				...quiz.toObject(),
				attemptCount: results.length,
				userResult: bestResult
					? {
							status: bestResult.status,
							totalScore: bestResult.totalScore,
							createdAt: bestResult.createdAt,
							_id: bestResult._id,
					  }
					: null,
			},
			200,
			res
		);
	}

	response(quiz, 200, res);
});
//get quiz by password
export const getQuizByPass = errorHandling(async (req, res, next) => {
	const { quizPassword, quizId } = req.body;
	if (!quizPassword || !quizId)
		return next(new appError("please enter the password and Id", 400));

	// 1) Find the quiz by ID and Password first
	const quiz = await quizModel
		.findOne({
			quizId,
			quizPassword,
		})
		.populate("questions");

	if (!quiz) return next(new appError("Invalid Quiz ID or Password", 404));

	// 2) Check if it has started
	const now = new Date();
	if (now < new Date(quiz.startDate)) {
		return next(new appError("This quiz has not started yet", 400));
	}

	// 3) Check if it has expired
	if (now > new Date(quiz.expireDate)) {
		return next(new appError("This quiz has already expired", 400));
	}

	response(quiz, 200, res);
});
// get all quizs
export const allQuizs = errorHandling(async (req, res, next) => {
	let filter = {};
	if (req.user.role === "teacher") {
		filter = { teacherId: req.user._id };
	} else if (req.user.role === "student") {
		// Students only see non-expired quizzes
		filter = { expireDate: { $gt: Date.now() } };
	}

	// Add search keyword filter
	if (req.query.keyword) {
		const keyword = req.query.keyword;
		filter.$or = [
			{ quizName: { $regex: keyword, $options: "i" } },
			{ quizId: { $regex: keyword, $options: "i" } },
		];
	}
	// Always delete keyword from query so ApiFeatures doesn't try to filter by it
	delete req.query.keyword;

	const features = new ApiFeatures(
		quizModel
			.find(filter)
			.populate("firstInQuiz.studentId", "name email image")
			.populate("secondInQuiz.studentId", "name email image")
			.populate("thirdInQuiz.studentId", "name email image"),
		req.query
	)
		.filter()
		.sort()
		.limitFields();

	const total = await features.query.clone().countDocuments();

	features.paginate();

	const quizzes = await features.query.populate("teacherId", "name email");
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 100;

	// If student, attach their result for each quiz
	if (req.user.role === "student") {
		const results = await quizResultModel.find({ studentId: req.user._id });

		const quizzesWithResults = quizzes.map((quiz) => {
			const studentResults = results.filter(
				(r) => r.quizId.toString() === quiz._id.toString()
			);

			// Find the best result (highest score) or latest result
			const bestResult = studentResults.reduce((prev, current) => {
				return prev.totalScore > current.totalScore ? prev : current;
			}, studentResults[0] || null);

			return {
				...quiz.toObject(),
				userResult: bestResult
					? {
							status: bestResult.status,
							totalScore: bestResult.totalScore,
							createdAt: bestResult.createdAt,
							_id: bestResult._id,
					  }
					: null,
				attemptCount: studentResults.length,
			};
		});
		return response(quizzesWithResults, 200, res, { total, page, limit });
	}

	response(quizzes, 200, res, { total, page, limit });
});

// admin get all quizs
export const allQuizzesByAdmin = factory.getAll(quizModel, {}, "teacherId");
// admin delete quiz
export const deleteQuizByAdmin = factory.deleteOne(quizModel);
// delete all quizs
export const deleteQuizs = errorHandling(async (req, res, next) => {
	let teacherId = req.user._id;

	// If admin and teacherId is provided in query, use that instead
	if (req.user.role === "admin" && req.query.teacherId) {
		teacherId = req.query.teacherId;
	}

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
