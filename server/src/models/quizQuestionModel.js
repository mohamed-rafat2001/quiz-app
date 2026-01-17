import mongoose from "mongoose";
import QuizModel from "./quizModel.js";

const quizQuestionSchema = new mongoose.Schema(
	{
		ques: {
			type: String,
			required: [true, "Question text is required"],
		},
		answers: {
			type: [String],
			required: [true, "Answers are required"],
			validate: [
				function (val) {
					return val.length >= 2;
				},
				"Question must have at least 2 answers",
			],
		},
		correctAnswer: {
			type: String,
			required: [true, "Correct answer is required"],
		},
		Score: {
			type: Number,
			default: 1,
			min: [0, "Score cannot be negative"],
		},
		quizId: {
			type: mongoose.Schema.ObjectId,
			ref: "QuizModel",
			required: [true, "Question must belong to a quiz"],
		},
		image: {
			public_id: String,
			secure_url: String,
		},
	},
	{ timestamps: true }
);

quizQuestionSchema.statics.calcTotalScore = async function (quizId) {
	const stats = await this.aggregate([
		{
			$match: { quizId: new mongoose.Types.ObjectId(quizId) },
		},
		{
			$group: {
				_id: "$quizId",
				totalScore: { $sum: "$Score" },
			},
		},
	]);

	if (stats.length > 0) {
		const quiz = await QuizModel.findById(quizId);
		if (quiz) {
			quiz.quizScore = stats[0].totalScore;
			await quiz.save();
		}
	} else {
		const quiz = await QuizModel.findById(quizId);
		if (quiz) {
			quiz.quizScore = 0;
			await quiz.save();
		}
	}
};

quizQuestionSchema.post("save", function () {
	this.constructor.calcTotalScore(this.quizId);
});

quizQuestionSchema.post(/^findOneAnd/, async function (doc) {
	if (doc) await doc.constructor.calcTotalScore(doc.quizId);
});

export default mongoose.model("QuizQuestionModel", quizQuestionSchema);
