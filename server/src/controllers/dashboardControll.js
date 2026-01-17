import UserModel from "../models/userModel.js";
import quizModel from "../models/quizModel.js";
import quizResultModel from "../models/quizResultModel.js";
import errorHandling from "../middelwars/errorHandling.js";
import response from "../utils/handelResponse.js";
import ApiFeatures from "../utils/apiFeatures.js";

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

		const [totalQuizzes, totalSubmissions, aggregatedStats] = await Promise.all(
			[
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
			]
		);

		stats = {
			totalQuizzes,
			totalSubmissions,
			avgSuccessRate: aggregatedStats[0]
				? (aggregatedStats[0].passCount / aggregatedStats[0].total) * 100
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

export const getTeacherQuizStats = errorHandling(async (req, res, next) => {
	const teacherId = req.user._id;

	// Build search query
	let searchFilter = { teacherId };
	if (req.query.keyword) {
		const keyword = req.query.keyword;
		searchFilter.$or = [
			{ quizName: { $regex: keyword, $options: "i" } },
			{ quizId: { $regex: keyword, $options: "i" } },
		];
	}
	// Always delete keyword from query so ApiFeatures doesn't try to filter by it
	delete req.query.keyword;

	const features = new ApiFeatures(quizModel.find(searchFilter), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	const quizzes = await features.query;

	// For each quiz, get stats
	const quizzesWithStats = await Promise.all(
		quizzes.map(async (quiz) => {
			const results = await quizResultModel.aggregate([
				{ $match: { quizId: quiz._id } },
				{
					$group: {
						_id: null,
						avgScore: { $avg: "$totalScore" },
						highestScore: { $max: "$totalScore" },
						lowestScore: { $min: "$totalScore" },
						passCount: { $sum: { $cond: ["$status", 1, 0] } },
						totalAttempts: { $sum: 1 },
					},
				},
			]);

			const stats = results[0] || {
				avgScore: 0,
				highestScore: 0,
				lowestScore: 0,
				passCount: 0,
				totalAttempts: 0,
			};

			return {
				...quiz.toObject(),
				stats: {
					...stats,
					avgScore: quiz.quizScore
						? (stats.avgScore / quiz.quizScore) * 100
						: 0,
					highestScore: quiz.quizScore
						? (stats.highestScore / quiz.quizScore) * 100
						: 0,
					successRate: stats.totalAttempts
						? (stats.passCount / stats.totalAttempts) * 100
						: 0,
				},
			};
		})
	);

	response(quizzesWithStats, 200, res);
});
