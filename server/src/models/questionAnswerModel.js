import mongoose from "mongoose";

const questionAnswerSchema = new mongoose.Schema(
	{
		studentId: {
			type: mongoose.Schema.ObjectId,
			ref: "UserModel",
			required: [true, "Answer must belong to a student"],
			index: true,
		},
		quizId: {
			type: mongoose.Schema.ObjectId,
			ref: "QuizModel",
			required: [true, "Answer must belong to a quiz"],
			index: true,
		},
		questionId: {
			type: mongoose.Schema.ObjectId,
			ref: "QuizQuestionModel",
			required: [true, "Answer must belong to a question"],
		},
		studentAnswer: {
			type: String,
			required: [true, "Student answer is required"],
		},
		isCorrect: {
			type: Boolean,
			default: false,
		},
		score: {
			type: Number,
			default: 0,
		},
		resultId: {
			type: mongoose.Schema.ObjectId,
			ref: "QuizResultModel",
			required: [true, "Answer must belong to a quiz result"],
		},
	},
	{ timestamps: true }
);

// Compound index to ensure a student only answers a specific question once per attempt
questionAnswerSchema.index({ resultId: 1, questionId: 1 }, { unique: true });

export default mongoose.model("QuestionAnswerModel", questionAnswerSchema);
