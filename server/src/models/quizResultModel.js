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

// Prevent duplicate quiz attempts
quizResultSchema.index({ quizId: 1, studentId: 1 }, { unique: true });

quizResultSchema.statics.calcQuizStats = async function (quizId) {
	const stats = await this.aggregate([
		{
			$match: { quizId: new mongoose.Types.ObjectId(quizId) },
		},
		{
			$group: {
				_id: "$quizId",
				numberTookQuiz: { $sum: 1 },
				avgScore: { $avg: "$totalScore" },
				maxScore: { $max: "$totalScore" },
				passingNum: {
					$sum: { $cond: [{ $eq: ["$status", true] }, 1, 0] },
				},
			},
		},
	]);

	if (stats.length > 0) {
		const allResults = await this.find({ quizId }).sort("-totalScore");
		const maxScore = stats[0].maxScore;
		const firstInQuiz = allResults
			.filter((res) => res.totalScore === maxScore)
			.map((res) => ({
				studentId: res.studentId,
				Score: res.totalScore,
			}));

		await QuizModel.findByIdAndUpdate(quizId, {
			numberTookQuiz: stats[0].numberTookQuiz,
			averagePassing: stats[0].avgScore,
			passingNum: stats[0].passingNum,
			firstInQuiz,
		});
	} else {
		await QuizModel.findByIdAndUpdate(quizId, {
			numberTookQuiz: 0,
			averagePassing: 0,
			passingNum: 0,
			firstInQuiz: [],
		});
	}
};

quizResultSchema.post("save", function () {
	this.constructor.calcQuizStats(this.quizId);
});

export default mongoose.model("QuizResultModel", quizResultSchema);
