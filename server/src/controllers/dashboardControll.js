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

		const [totalQuizzes, totalSubmissions, stats] = await Promise.all([
			quizModel.countDocuments({ teacherId }),
			quizResultModel.countDocuments({ quizId: { $in: quizIds } }),
			quizResultModel.aggregate([
				{ $match: { quizId: { $in: quizIds } } },
				{
					$group: {
						_id: null,
						avgScore: { $avg: "$totalScore" },
						passCount: { $sum: { $cond: ["$status", 1, 0] } },
						total: { $sum: 1 },
					},
				},
			]),
		]);

		stats = {
			totalQuizzes,
			totalSubmissions,
			avgSuccessRate: stats[0]
				? (stats[0].passCount / stats[0].total) * 100
				: 0,
		};
	} else if (role === "student") {
		const studentId = req.user._id;

		const [totalTaken, passedCount, results] = await Promise.all([
			quizResultModel.countDocuments({ studentId }),
			quizResultModel.countDocuments({ studentId, status: true }),
			quizResultModel.find({ studentId }).populate("quizId", "quizScore"),
		]);

		// Calculate weighted average score
		let totalPointsEarned = 0;
		let totalPossiblePoints = 0;

		results.forEach((res) => {
			if (res.quizId) {
				totalPointsEarned += res.totalScore;
				totalPossiblePoints += res.quizId.quizScore;
			}
		});

		stats = {
			totalTaken,
			passedCount,
			failedCount: totalTaken - passedCount,
			avgScore:
				totalPossiblePoints > 0
					? (totalPointsEarned / totalPossiblePoints) * 100
					: 0,
		};
	}

	response(stats, 200, res);
});
