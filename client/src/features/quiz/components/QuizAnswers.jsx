import { useParams, Link } from "react-router-dom";
import { useTeacherQuizAnswers, useQuiz } from "../hooks/useQuiz";
import Loader from "../../../shared/components/ui/Loader";
import { motion } from "framer-motion";
import {
	HiArrowLeft,
	HiEye,
	HiUserMinus,
	HiUsers,
	HiCheckBadge,
	HiXCircle,
	HiChartBar,
	HiTrophy,
	HiClock,
	HiClipboardDocumentList,
} from "react-icons/hi2";
import { useMemo, useState, useEffect } from "react";
import Pagination from "../../../shared/components/ui/Pagination";
import Leaderboard from "./Leaderboard";

const QuizHeader = ({ quiz }) => (
	<motion.div
		initial={{ opacity: 0, y: -20 }}
		animate={{ opacity: 1, y: 0 }}
		className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6"
	>
		<div>
			<Link
				to="/app/dashboard"
				className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-all text-sm group mb-4"
			>
				<HiArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" />
				Back to Dashboard
			</Link>
			<h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
				{quiz?.quizName || "Quiz"} - Submissions
			</h1>
			<p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
				Review student performance and detailed analytics
			</p>
			{quiz?.quizId && (
				<div className="flex items-center gap-2 mt-2">
					<span className="text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
						ID: {quiz.quizId}
					</span>
				</div>
			)}
		</div>
	</motion.div>
);

const StatCard = ({
	title,
	value,
	icon: Icon,
	color,
	subtitle,
	onClick,
	isActive,
}) => (
	<div
		onClick={onClick}
		className={`bg-white dark:bg-gray-800/50 p-5 rounded-xl border transition-all duration-200 shadow-sm ${
			onClick ? "cursor-pointer hover:shadow-md" : ""
		} ${
			isActive
				? "border-indigo-500 ring-1 ring-indigo-500 dark:border-indigo-400 dark:ring-indigo-400"
				: "border-gray-100 dark:border-gray-700"
		}`}
	>
		<div className="flex items-center gap-3">
			<div
				className={`p-2.5 rounded-lg ${color} bg-opacity-10 dark:bg-opacity-20`}
			>
				<Icon className={`text-xl ${color.replace("bg-", "text-")}`} />
			</div>
			<div>
				<p className="text-xs font-medium text-gray-500 dark:text-gray-400">
					{title}
				</p>
				<p className="text-xl font-black text-gray-900 dark:text-white">
					{value}
				</p>
				{subtitle && (
					<p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
				)}
			</div>
		</div>
	</div>
);

const StatsOverview = ({
	quiz,
	stats: backendStats,
	activeFilter,
	onFilterChange,
}) => {
	const displayStats = useMemo(() => {
		if (backendStats) {
			const max = quiz?.quizScore || 100;
			return {
				totalAttempts: backendStats.totalAttempts || 0,
				passed: backendStats.passed || 0,
				failed: backendStats.failed || 0,
				avgScore: max > 0 ? ((backendStats.avgScoreRaw || 0) / max) * 100 : 0,
				highestScore:
					max > 0 ? ((backendStats.highestScoreRaw || 0) / max) * 100 : 0,
				successRate: backendStats.successRate || 0,
			};
		}
		return {
			totalAttempts: 0,
			passed: 0,
			failed: 0,
			avgScore: 0,
			highestScore: 0,
			successRate: 0,
		};
	}, [backendStats, quiz]);

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
			<StatCard
				title="Total Attempts"
				value={displayStats.totalAttempts}
				icon={HiUsers}
				color="bg-blue-500"
				onClick={() => onFilterChange(undefined)}
				isActive={activeFilter === undefined}
			/>
			<StatCard
				title="Passed"
				value={displayStats.passed}
				icon={HiCheckBadge}
				color="bg-green-500"
				onClick={() => onFilterChange("true")}
				isActive={activeFilter === "true"}
			/>
			<StatCard
				title="Failed"
				value={displayStats.failed}
				icon={HiXCircle}
				color="bg-red-500"
				onClick={() => onFilterChange("false")}
				isActive={activeFilter === "false"}
			/>
			<StatCard
				title="Avg Score"
				value={`${Math.round(displayStats.avgScore)}%`}
				icon={HiChartBar}
				color="bg-indigo-500"
			/>
			<StatCard
				title="Highest"
				value={`${Math.round(displayStats.highestScore)}%`}
				icon={HiTrophy}
				color="bg-yellow-500"
			/>
			<StatCard
				title="Success Rate"
				value={`${Math.round(displayStats.successRate)}%`}
				icon={HiClipboardDocumentList}
				color="bg-purple-500"
				subtitle={
					displayStats.successRate >= 70
						? "Good!"
						: displayStats.successRate >= 50
						? "Average"
						: "Needs work"
				}
			/>
		</div>
	);
};

const AnswerRow = ({ answer, index, maxScore }) => {
	const scorePercent =
		maxScore > 0 ? ((answer.score || 0) / maxScore) * 100 : 0;

	return (
		<motion.tr
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.03 }}
			className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors group"
		>
			<td className="px-6 py-4 text-sm font-bold text-gray-400 dark:text-gray-500">
				{index + 1}
			</td>
			<td className="px-6 py-4">
				<Link
					to={`/app/users/${answer.studentId._id}`}
					className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-1 -m-1 rounded-lg transition-colors"
				>
					<div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
						<img
							src={answer.studentId.image}
							alt={answer.studentId.name}
							className="w-full h-full object-cover"
						/>
					</div>
					<div>
						<p className="font-bold text-gray-900 dark:text-white">
							{answer.studentId.name}
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							{answer.studentId.email}
						</p>
					</div>
				</Link>
			</td>
			<td className="px-6 py-4 text-center">
				<div className="flex flex-col items-center">
					<span className="text-lg font-black text-gray-900 dark:text-white">
						{answer.score || 0}
					</span>
					<span className="text-xs text-gray-400 dark:text-gray-500">
						/ {maxScore} ({Math.round(scorePercent)}%)
					</span>
				</div>
			</td>
			<td className="px-6 py-4 text-center">
				<span
					className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
						answer.isPass
							? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
							: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
					}`}
				>
					{answer.isPass ? (
						<>
							<HiCheckBadge /> Passed
						</>
					) : (
						<>
							<HiXCircle /> Failed
						</>
					)}
				</span>
			</td>
			<td className="px-6 py-4">
				<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
					<HiClock className="text-gray-400" />
					{new Date(answer.createdAt).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
						hour: "2-digit",
						minute: "2-digit",
					})}
				</div>
			</td>
			<td className="px-6 py-4 text-right">
				<Link
					to={`/app/my-submissions/${answer._id}`}
					className="inline-flex items-center gap-1.5 px-3 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all text-sm font-bold"
					title="View Details"
				>
					<HiEye />
					View
				</Link>
			</td>
		</motion.tr>
	);
};

const EmptyState = () => (
	<div className="py-16 text-center">
		<div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-300 dark:text-gray-500">
			<HiUserMinus className="text-4xl" />
		</div>
		<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
			No submissions yet
		</h3>
		<p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">
			Students haven't completed this quiz yet. Share the quiz ID with your
			students to get started.
		</p>
	</div>
);

export default function QuizAnswers() {
	const { id } = useParams();
	const [page, setPage] = useState(1);
	const [filterStatus, setFilterStatus] = useState(undefined);

	useEffect(() => {
		setPage(1);
	}, [filterStatus]);

	const { data: response, isLoading: isLoadingAnswers } = useTeacherQuizAnswers(
		id,
		{
			page,
			limit: 10,
			status: filterStatus,
		}
	);
	const answers = response?.data || [];
	const meta = response?.meta || {};
	const { data: quiz, isLoading: isLoadingQuiz } = useQuiz(id);

	if (isLoadingAnswers || isLoadingQuiz) return <Loader />;

	const maxScore = quiz?.quizScore || 100;

	return (
		<div className="py-6 px-4 max-w-7xl mx-auto">
			<QuizHeader quiz={quiz} />

			{/* Statistics Overview */}
			<StatsOverview
				quiz={quiz}
				stats={meta.stats}
				activeFilter={filterStatus}
				onFilterChange={setFilterStatus}
			/>

			{/* Leaderboard */}
			<div className="mb-8 bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
				<Leaderboard quiz={quiz} className="" />
			</div>

			{/* Submissions Table */}
			<div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
				<div className="p-5 border-b border-gray-100 dark:border-gray-700">
					<h3 className="text-lg font-bold text-gray-900 dark:text-white">
						Student Submissions
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
						{meta.total || 0} total submission
						{meta.total !== 1 ? "s" : ""}
					</p>
				</div>

				{!answers || answers.length === 0 ? (
					<EmptyState />
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead>
								<tr className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
									<th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
										#
									</th>
									<th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Student
									</th>
									<th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Score
									</th>
									<th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Date
									</th>
									<th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100 dark:divide-gray-700">
								{answers.map((answer, index) => (
									<AnswerRow
										key={answer._id}
										answer={answer}
										index={index}
										maxScore={maxScore}
									/>
								))}
							</tbody>
						</table>
					</div>
				)}
				{!isLoadingAnswers && answers.length > 0 && (
					<div className="p-4 border-t border-gray-100 dark:border-gray-700">
						<Pagination
							page={page}
							limit={meta.limit || 10}
							total={meta.total || 0}
							onPageChange={setPage}
							className="justify-center mt-0"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
