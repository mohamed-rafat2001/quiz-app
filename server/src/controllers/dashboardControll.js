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
		const [totalStudents, totalTeachers, totalQuizzes, totalResults, registrationTrend, quizTrend] =
			await Promise.all([
				UserModel.countDocuments({ role: "student" }),
				UserModel.countDocuments({ role: "teacher" }),
				quizModel.countDocuments(),
				quizResultModel.countDocuments(),
				UserModel.aggregate([
					{
						$match: {
							role: { $in: ["student", "teacher"] },
							createdAt: {
								$gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
							},
						},
					},
					{
						$group: {
							_id: {
								year: { $year: "$createdAt" },
								month: { $month: "$createdAt" },
							},
							count: { $sum: 1 },
						},
					},
					{ $sort: { "_id.year": 1, "_id.month": 1 } },
				]),
				quizModel.aggregate([
					{
						$match: {
							createdAt: {
								$gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
							},
						},
					},
					{
						$group: {
							_id: {
								year: { $year: "$createdAt" },
								month: { $month: "$createdAt" },
							},
							count: { $sum: 1 },
						},
					},
					{ $sort: { "_id.year": 1, "_id.month": 1 } },
				]),
			]);

		// Format trend data for charts
		const months = [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];

		// Create a map of all months in the last 6 months to ensure we have data for each
		const trendMap = {};
		for (let i = 5; i >= 0; i--) {
			const d = new Date();
			d.setMonth(d.getMonth() - i);
			const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
			trendMap[key] = { name: key, users: 0, quizzes: 0 };
		}

		registrationTrend.forEach(item => {
			const key = `${months[item._id.month - 1]} ${item._id.year}`;
			if (trendMap[key]) trendMap[key].users = item.count;
		});

		quizTrend.forEach(item => {
			const key = `${months[item._id.month - 1]} ${item._id.year}`;
			if (trendMap[key]) trendMap[key].quizzes = item.count;
		});

		const formattedTrend = Object.values(trendMap);

		stats = {
			totalStudents,
			totalTeachers,
			totalQuizzes,
			totalResults,
			combinedTrend: formattedTrend,
			roleDistribution: [
				{ name: "Students", value: totalStudents },
				{ name: "Teachers", value: totalTeachers },
			],
		};
	} else if (role === "teacher") {
		const teacherId = req.user._id;
		const quizzes = await quizModel.find({ teacherId }).sort({ createdAt: -1 });
		const quizIds = quizzes.map((q) => q._id);

		const [totalQuizzes, totalSubmissions, aggregatedStats, uniqueStudents] =
			await Promise.all([
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
				quizResultModel.distinct("studentId", { quizId: { $in: quizIds } }),
			]);

		// Performance data for top 5 recent quizzes
		const quizPerformance = await Promise.all(
			quizzes.slice(0, 5).map(async (q) => {
				const results = await quizResultModel.aggregate([
					{ $match: { quizId: q._id } },
					{
						$group: {
							_id: null,
							avgScore: { $avg: "$totalScore" },
							totalAttempts: { $sum: 1 },
						},
					},
				]);

				const stats = results[0] || { avgScore: 0, totalAttempts: 0 };
				return {
					name:
						q.quizName.length > 12
							? q.quizName.substring(0, 10) + "..."
							: q.quizName,
					avgScore: Math.round(
						q.quizScore > 0 ? (stats.avgScore / q.quizScore) * 100 : 0
					),
					attempts: stats.totalAttempts,
				};
			})
		);

		stats = {
			totalQuizzes,
			totalSubmissions,
			totalStudentsTaken: uniqueStudents.length,
			avgSuccessRate: aggregatedStats[0]
				? (aggregatedStats[0].passCount / aggregatedStats[0].total) * 100
				: 0,
			quizPerformance,
			passFailData: aggregatedStats[0]
				? [
						{ name: "Passed", value: aggregatedStats[0].passCount },
						{
							name: "Failed",
							value: aggregatedStats[0].total - aggregatedStats[0].passCount,
						},
				  ]
				: [
						{ name: "Passed", value: 0 },
						{ name: "Failed", value: 0 },
				  ],
		};
	} else if (role === "student") {
		const studentId = req.user._id;

		const [totalTaken, passedCount, results] = await Promise.all([
			quizResultModel.countDocuments({ studentId }),
			quizResultModel.countDocuments({ studentId, status: true }),
			quizResultModel
				.find({ studentId })
				.populate("quizId", "quizName quizScore")
				.sort({ createdAt: 1 }),
		]);

		const scoreTrend = results.map((r) => ({
			name: r.quizId?.quizName?.substring(0, 10) || "Quiz",
			score: Math.round(
				r.quizId?.quizScore > 0 ? (r.totalScore / r.quizId.quizScore) * 100 : 0
			),
			fullScore: 100,
		}));

		const totalPercentage = results.reduce((acc, curr) => {
			const percentage =
				curr.quizId?.quizScore > 0
					? (curr.totalScore / curr.quizId.quizScore) * 100
					: 0;
			return acc + percentage;
		}, 0);

		const bestScore = results.length
			? Math.max(
					...results.map((r) =>
						r.quizId?.quizScore > 0
							? (r.totalScore / r.quizId.quizScore) * 100
							: 0
					)
			  )
			: 0;

		stats = {
			quizzesTaken: totalTaken,
			passedCount,
			failedCount: totalTaken - passedCount,
			avgScore: totalTaken > 0 ? totalPercentage / totalTaken : 0,
			bestScore: Math.round(bestScore),
			totalTimeSpent: totalTaken * 10, // Placeholder as time is not in model
			scoreTrend,
		};
	}

	response(stats, 200, res);
});

export const getTeacherQuizStats = errorHandling(async (req, res, next) => {
	// Build search query
	let searchFilter = {};
	if (req.user.role !== "admin") {
		searchFilter.teacherId = req.user._id;
	}
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
		.limitFields();

	const total = await features.query.clone().countDocuments();

	features.paginate();

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

	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 100;

	response(quizzesWithStats, 200, res, { total, page, limit });
});
