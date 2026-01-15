import quizModel from "../models/quizModel.js";
import questionAnswerModel from "../models/questionAnswerModel.js";
import quizResultModel from "../models/quizResultModel.js";

import errorHandling from "../middelwars/errorHandling.js";
import appError from "../utils/appError.js";
import response from "../utils/handelResponse.js";
import Email from "../utils/Email.js";
import * as factory from "../utils/handlerFactory.js";

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

	// check if student already answered the quiz
	const existingResult = await quizResultModel.findOne({
		quizId: _id,
		studentId: req.user._id,
	});
	if (existingResult)
		return next(new appError("You have already answered this quiz", 400));

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
export const getQuizAnswer = factory.getOne(quizResultModel, {
	path: "quizId",
});

// get all quiz results for student
export const studentquizAnswers = factory.getAllOwner(
	quizResultModel,
	"studentId",
	{ path: "quizId", select: "quizName" }
);

// get all quiz results for teacher's specific quiz
export const getTeacherQuizAnswers = errorHandling(async (req, res, next) => {
	const filter = {
		teacherId: req.user._id,
		quizId: req.params.id,
	};

	const docs = await quizResultModel
		.find(filter)
		.populate("studentId")
		.populate("quizId");

	response(docs, 200, res);
});

// get individual question answers for a specific result
export const getResultDetails = errorHandling(async (req, res, next) => {
	const answers = await questionAnswerModel
		.find({ resultId: req.params.id })
		.populate("questionId");
	response(answers, 200, res);
});
