import quizModel from "../models/quizModel.js";
import questionAnswerModel from "../models/questionAnswerModel.js";
import quizResultModel from "../models/quizResultModel.js";

import errorHandling from "../middelwars/errorHandling.js";
import appError from "../utils/appError.js";
import response from "../utils/handelResponse.js";
import Email from "../utils/Email.js";
import * as factory from "../utils/handlerFactory.js";
import ApiFeatures from "../utils/apiFeatures.js";

// questions answer
export const quesAnswer = errorHandling(async (req, res, next) => {
	const _id = req.params.id;
	const { questions } = req.body; // Array of { _id: questionId, answer: studentChoice }

	// check if user is student
	if (req.user.role !== "student")
		return next(new appError("You are not a student", 403));

	// find the quiz
	const quiz = await quizModel.findById(_id).populate("questions");
	if (!quiz) return next(new appError("Quiz not found", 404));

	// check if student already reached max tries
	const attemptCount = await quizResultModel.countDocuments({
		quizId: _id,
		studentId: req.user._id,
	});

	if (attemptCount >= (quiz.tries || 1)) {
		return next(
			new appError(
				`You have reached the maximum number of attempts (${
					quiz.tries || 1
				}) for this quiz`,
				400
			)
		);
	}

	if (!questions || questions.length === 0)
		return next(new appError("Please provide answers", 400));

	// 1. Create the QuizResult first (initial state)
	const quizResult = await quizResultModel.create({
		teacherId: quiz.teacherId,
		studentId: req.user._id,
		quizId: quiz._id,
		quizName: quiz.quizName,
	});

	let totalScore = 0;
	const answerDocs = [];

	// 2. Process each question and create QuestionAnswer docs
	for (const qAnswer of questions) {
		const question = quiz.questions.find(
			(q) => q._id.toString() === qAnswer._id
		);

		if (question) {
			const isCorrect = question.correctAnswer === qAnswer.answer;
			const score = isCorrect ? question.Score : 0;
			totalScore += score;

			answerDocs.push({
				studentId: req.user._id,
				quizId: quiz._id,
				questionId: question._id,
				studentAnswer: qAnswer.answer,
				isCorrect,
				score,
				resultId: quizResult._id,
				image: qAnswer.image,
			});
		}
	}

	// 3. Bulk create question answers
	await questionAnswerModel.insertMany(answerDocs);

	// 4. Update the final result
	quizResult.totalScore = totalScore;
	quizResult.status = totalScore >= quiz.successRate;
	await quizResult.save();

	// 5. Send email notification
	try {
		const message = quizResult.status
			? `Congratulations ${req.user.name}, you passed the quiz: ${quiz.quizName} with a score of ${totalScore}.`
			: `Sorry ${req.user.name}, you did not pass the quiz: ${quiz.quizName}. Your score was ${totalScore}.`;

		await new Email(req.user).passQuizEmail(message);
	} catch (err) {
		// Don't fail the request if email fails
	}

	response(quizResult, 201, res);
});

// get quiz result by params
export const getQuizAnswer = errorHandling(async (req, res, next) => {
	const result = await quizResultModel.findById(req.params.id).populate("quizId");
	if (!result) return next(new appError("Result not found", 404));

	const isExamFinished =
		result.quizId && new Date(result.quizId.expireDate) < new Date();
	const isTeacherOrAdmin = ["teacher", "admin"].includes(req.user.role);

	const resultObj = result.toObject();

	if (!isExamFinished && !isTeacherOrAdmin) {
		// Hide sensitive info for students if exam not finished
		delete resultObj.totalScore;
		delete resultObj.status;
		delete resultObj.score; // virtual
		delete resultObj.isPass; // virtual
	}

	response(resultObj, 200, res);
});

// get all quiz results for student
export const studentquizAnswers = errorHandling(async (req, res, next) => {
	// 1. Get attempt counts for ALL quizzes for this student to ensure accuracy across pages
	const allResults = await quizResultModel
		.find({ studentId: req.user._id })
		.select("quizId");
	const quizAttemptCounts = {};
	allResults.forEach((r) => {
		const qId = r.quizId?.toString();
		if (qId) {
			quizAttemptCounts[qId] = (quizAttemptCounts[qId] || 0) + 1;
		}
	});

	// 2. Apply ApiFeatures for the paginated/filtered results
	const features = new ApiFeatures(
		quizResultModel.find({ studentId: req.user._id }),
		req.query
	)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	const results = await features.query.populate({
		path: "quizId",
		select: "quizName tries expireDate",
	});

	// 3. Attach attemptCount to each result and hide sensitive info if exam not finished
	const resultsWithCounts = results.map((r) => {
		const qId = r.quizId?._id?.toString();
		const isExamFinished =
			r.quizId?.expireDate && new Date(r.quizId.expireDate) < new Date();
		const resultObj = r.toObject();

		if (!isExamFinished) {
			delete resultObj.totalScore;
			delete resultObj.status;
			delete resultObj.score;
			delete resultObj.isPass;
		}

		return {
			...resultObj,
			attemptCount: qId ? quizAttemptCounts[qId] : 0,
		};
	});

	response(resultsWithCounts, 200, res);
});

// get all quiz results for teacher's specific quiz
// get all quiz results for teacher's specific quiz
export const getTeacherQuizAnswers = errorHandling(async (req, res, next) => {
	let filter = {
		quizId: req.params.id,
	};

	if (req.user.role !== "admin") {
		filter.teacherId = req.user._id;
	}

	// Calculate Stats (Global for this quiz)
	// We clone a basic query for stats to avoid filters affecting the overview stats
	const statsQuery = { ...filter };
	const allResults = await quizResultModel
		.find(statsQuery)
		.select("status totalScore");

	const totalAttempts = allResults.length;
	const passed = allResults.filter((r) => r.status).length;
	const failed = totalAttempts - passed;
	const scores = allResults.map((r) => r.totalScore || 0);
	const avgScoreRaw =
		totalAttempts > 0
			? scores.reduce((sum, s) => sum + s, 0) / totalAttempts
			: 0;
	const highestScoreRaw = scores.length ? Math.max(...scores) : 0;
	const lowestScoreRaw = scores.length ? Math.min(...scores) : 0;
	const successRate = totalAttempts > 0 ? (passed / totalAttempts) * 100 : 0;

	const stats = {
		totalAttempts,
		passed,
		failed,
		avgScoreRaw,
		highestScoreRaw,
		lowestScoreRaw,
		successRate,
	};

	// Apply Filters for Listing (e.g. status=true/false)
	if (req.query.status !== undefined) {
		// status comes as string 'true' or 'false'
		filter.status = req.query.status === "true";
	}

	const features = new ApiFeatures(
		quizResultModel.find(filter).populate("studentId").populate("quizId"),
		req.query
	)
		.filter()
		.sort()
		.limitFields();

	const total = await features.query.clone().countDocuments();

	features.paginate();
	const docs = await features.query;

	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 100;

	response(docs, 200, res, { total, page, limit, stats });
});

// get individual question answers for a specific result
export const getResultDetails = errorHandling(async (req, res, next) => {
	const resultId = req.params.id;

	// 1. Get the quiz result to find the quizId
	const result = await quizResultModel.findById(resultId);
	if (!result) return next(new appError("Result not found", 404));

	// 2. Get the quiz to check the expireDate
	const quiz = await quizModel.findById(result.quizId);
	if (!quiz) return next(new appError("Quiz not found", 404));

	const isExamFinished = new Date(quiz.expireDate) < new Date();
	const isTeacherOrAdmin = ["teacher", "admin"].includes(req.user.role);

	// 3. Get all answers for this result
	let query = questionAnswerModel
		.find({ resultId })
		.populate("questionId");

	const docs = await query;

	// 4. If student and exam NOT finished, hide correct answers and isCorrect status
	const processedDocs = docs.map((doc) => {
		const docObj = doc.toObject();

		if (!isExamFinished && !isTeacherOrAdmin) {
			// Hide sensitive info
			if (docObj.questionId) {
				delete docObj.questionId.correctAnswer;
			}
			delete docObj.isCorrect;
			delete docObj.score;
		}

		return docObj;
	});

	response(processedDocs, 200, res);
});
