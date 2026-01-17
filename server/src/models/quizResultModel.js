import mongoose from "mongoose";
import QuizModel from "./quizModel.js";

const quizResultSchema = new mongoose.Schema(
	{
		studentId: {
			type: mongoose.Schema.ObjectId,
			ref: "UserModel",
			required: [true, "Result must belong to a student"],
			index: true,
		},
		teacherId: {
			type: mongoose.Schema.ObjectId,
			ref: "UserModel",
			required: [true, "Result must belong to a teacher"],
			index: true,
		},
		quizId: {
			type: mongoose.Schema.ObjectId,
			ref: "QuizModel",
			required: [true, "Result must belong to a quiz"],
			index: true,
		},
		quizName: String,
		totalScore: {
			type: Number,
			default: 0,
		},
		status: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtuals for backward compatibility with frontend
quizResultSchema.virtual("isPass").get(function () {
	return this.status;
});

quizResultSchema.virtual("score").get(function () {
	return this.totalScore;
});

// Populate student info
quizResultSchema.pre(/^find/, function (next) {
	this.populate({
		path: "studentId",
		select: "name email",
	});
	next();
});

// Allow multiple quiz attempts
quizResultSchema.index({ quizId: 1, studentId: 1 });

quizResultSchema.statics.calcQuizStats = async function (quizId) {
	const stats = await this.aggregate([
		{
			$match: { quizId: new mongoose.Types.ObjectId(quizId) },
		},
		{
			// Group by student to get their best performance
			$group: {
				_id: "$studentId",
				bestScore: { $max: "$totalScore" },
				passed: {
					$max: { $cond: [{ $eq: ["$status", true] }, 1, 0] },
				},
			},
		},
		{
			// Aggregate student bests for quiz stats
			$group: {
				_id: null,
				numberTookQuiz: { $sum: 1 },
				avgScore: { $avg: "$bestScore" },
				maxScore: { $max: "$bestScore" },
				passingNum: { $sum: "$passed" },
			},
		},
	]);

	if (stats.length > 0) {
		// Get all unique student best scores sorted descending
		const studentBestScores = await this.aggregate([
			{ $match: { quizId: new mongoose.Types.ObjectId(quizId) } },
			{
				$group: {
					_id: "$studentId",
					bestScore: { $max: "$totalScore" },
				},
			},
			{ $sort: { bestScore: -1 } },
		]);

		// Find the top 3 distinct scores
		const distinctScores = [
			...new Set(studentBestScores.map((s) => s.bestScore)),
		].slice(0, 3);

		const getStudentsByScore = (score) => {
			if (score === undefined) return [];
			// Find unique students who achieved this specific score
			const studentIds = studentBestScores
				.filter((s) => s.bestScore === score)
				.map((s) => s._id);

			return studentIds.map((id) => ({
				studentId: id,
				Score: score,
			}));
		};

		const firstInQuiz = getStudentsByScore(distinctScores[0]);
		const secondInQuiz = getStudentsByScore(distinctScores[1]);
		const thirdInQuiz = getStudentsByScore(distinctScores[2]);

		await QuizModel.findByIdAndUpdate(quizId, {
			numberTookQuiz: stats[0].numberTookQuiz,
			averagePassing: stats[0].avgScore,
			passingNum: stats[0].passingNum,
			firstInQuiz,
			secondInQuiz,
			thirdInQuiz,
		});
	} else {
		await QuizModel.findByIdAndUpdate(quizId, {
			numberTookQuiz: 0,
			averagePassing: 0,
			passingNum: 0,
			firstInQuiz: [],
			secondInQuiz: [],
			thirdInQuiz: [],
		});
	}
};

quizResultSchema.post("save", function () {
	this.constructor.calcQuizStats(this.quizId);
});

export default mongoose.model("QuizResultModel", quizResultSchema);
