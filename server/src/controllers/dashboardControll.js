import UserModel from "../models/userModel.js";
import quizModel from "../models/quizModel.js";
import quizResultModel from "../models/quizResultModel.js";
import errorHandling from "../middelwars/errorHandling.js";
import response from "../utils/handelResponse.js";

export const getStats = errorHandling(async (req, res, next) => {
	const role = req.user.role;
	let stats = {};

	if (role === "admin") {
		const [totalStudents, totalTeachers, totalQuizzes, totalResults] =
			await Promise.all([
				UserModel.countDocuments({ role: "student" }),
				UserModel.countDocuments({ role: "teacher" }),
				quizModel.countDocuments(),
				quizResultModel.countDocuments(),
			]);

		stats = {
			totalStudents,
			totalTeachers,
			totalQuizzes,
			totalResults,
		};
	} else if (role === "teacher") {
		const teacherId = req.user._id;
		const quizzes = await quizModel.find({ teacherId });
		const quizIds = quizzes.map((q) => q._id);

		const [totalQuizzes, totalSubmissions, avgSuccessRate] = await Promise.all([
			quizModel.countDocuments({ teacherId }),
			quizResultModel.countDocuments({ quizId: { $in: quizIds } }),
			quizModel.aggregate([
				{ $match: { teacherId } },
				{ $group: { _id: null, avg: { $avg: "$successRate" } } },
			]),
		]);

		stats = {
			totalQuizzes,
			totalSubmissions,
			avgSuccessRate: avgSuccessRate[0]?.avg || 0,
		};
	} else if (role === "student") {
		const studentId = req.user._id;

		const [totalTaken, passedCount, avgScore] = await Promise.all([
			quizResultModel.countDocuments({ studentId }),
			quizResultModel.countDocuments({ studentId, isPass: true }),
			quizResultModel.aggregate([
				{ $match: { studentId } },
				{
					$group: {
						_id: null,
						avg: {
							$avg: {
								$multiply: [{ $divide: ["$score", "$totalScore"] }, 100],
							},
						},
					},
				},
			]),
		]);

		stats = {
			totalTaken,
			passedCount,
			failedCount: totalTaken - passedCount,
			avgScore: avgScore[0]?.avg || 0,
		};
	}

	response(stats, 200, res);
});
