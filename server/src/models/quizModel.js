import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
const quizSchema = new mongoose.Schema(
	{
		quizName: {
			type: String,
			required: [true, "Quiz name is required"],
			trim: true,
		},
		teacherId: {
			type: mongoose.Schema.ObjectId,
			ref: "UserModel",
			required: [true, "Quiz must belong to a teacher"],
			index: true,
		},
		questions: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "QuizQuestionModel",
			},
		],
		numberTookQuiz: {
			type: Number,
			default: 0,
		},
		quizScore: {
			type: Number,
			default: 0,
		},
		successRate: {
			type: Number,
			default: 0,
		},
		passingNum: {
			type: Number,
			default: 0,
		},
		averagePassing: {
			type: Number,
			default: 0,
		},
		firstInQuiz: [
			{
				studentId: {
					type: mongoose.Schema.ObjectId,
					ref: "UserModel",
				},
				Score: Number,
			},
		],
		secondInQuiz: [
			{
				studentId: {
					type: mongoose.Schema.ObjectId,
					ref: "UserModel",
				},
				Score: Number,
			},
		],
		thirdInQuiz: [
			{
				studentId: {
					type: mongoose.Schema.ObjectId,
					ref: "UserModel",
				},
				Score: Number,
			},
		],
		quizId: {
			type: String,
			unique: true,
			index: true,
		},
		quizPassword: {
			type: String,
			required: true,
		},
		expire: {
			type: Number,
			default: 60,
			min: [1, "Time limit must be at least 1 minute"],
		},
		expireUnit: {
			type: String,
			enum: ["minutes", "hours"],
			default: "minutes",
		},
		expireDate: {
			type: Date,
			required: [true, "Quiz deadline is required"],
		},
		tries: {
			type: Number,
			default: 1,
			min: [1, "Tries must be at least 1"],
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

quizSchema.virtual("isExpired").get(function () {
	return this.expireDate < Date.now();
});

quizSchema.pre("save", function (next) {
	// Set default successRate to 50% of quizScore if not set
	if (
		this.isModified("quizScore") &&
		this.successRate === 0 &&
		this.quizScore > 0
	) {
		this.successRate = this.quizScore / 2;
	}
	next();
});

// Cascade delete: remove questions, results, and answers when a quiz is deleted
quizSchema.pre("findOneAndDelete", async function (next) {
	const quiz = await this.model.findOne(this.getQuery());
	if (quiz) {
		await mongoose.model("QuizQuestionModel").deleteMany({ quizId: quiz._id });
		await mongoose.model("QuizResultModel").deleteMany({ quizId: quiz._id });
		await mongoose
			.model("QuestionAnswerModel")
			.deleteMany({ quizId: quiz._id });
	}
	next();
});

//Export the model
export default mongoose.model("QuizModel", quizSchema);
