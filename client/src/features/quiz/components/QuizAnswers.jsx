import { useParams, Link } from "react-router-dom";
import { useTeacherQuizAnswers, useQuiz } from "../hooks/useQuiz";
import Loader from "../../../shared/components/ui/Loader";
import { motion } from "framer-motion";
import {
	HiArrowLeft,
	HiEye,
	HiUserMinus,
	HiCheckBadge,
	HiXCircle,
	HiClock,
} from "react-icons/hi2";
import { useState, useEffect } from "react";
import Pagination from "../../../shared/components/ui/Pagination";
import Leaderboard from "./Leaderboard";
import StatsOverview from "./StatsOverview";

const QuizHeader = ({ quiz }) => (
	<motion.div
		initial={{ opacity: 0, y: -20 }}
		animate={{ opacity: 1, y: 0 }}
		className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6"
	>
		<div>
			<Link
				to="/app/dashboard"
				className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-all text-sm group mb-4 focus:ring-2 focus:ring-indigo-500/40 outline-none rounded-md"
			>
				<HiArrowLeft
					className="text-lg group-hover:-translate-x-1 transition-transform"
					aria-hidden="true"
				/>
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
					className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-1 -m-1 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500/40 outline-none"
					aria-label={`View profile of ${answer.studentId.name}`}
				>
					<div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
						{answer.studentId.image ? (
							<img
								src={answer.studentId.image}
								alt=""
								className="w-full h-full object-cover"
								referrerPolicy="no-referrer"
								loading="lazy"
								onError={(e) => {
									e.target.onerror = null;
									e.target.style.display = 'none';
									e.target.parentElement.innerHTML = `<span class="text-[10px] font-black text-gray-400 dark:text-white/40 flex items-center justify-center h-full">${answer.studentId.name.charAt(0).toUpperCase()}</span>`;
								}}
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-400 dark:text-white/40">
								{answer.studentId.name.charAt(0).toUpperCase()}
							</div>
						)}
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
							<HiCheckBadge aria-hidden="true" /> Passed
						</>
					) : (
						<>
							<HiXCircle aria-hidden="true" /> Failed
						</>
					)}
				</span>
			</td>
			<td className="px-6 py-4">
				<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
					<HiClock className="text-gray-400" aria-hidden="true" />
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
					className="inline-flex items-center gap-1.5 px-3 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all text-sm font-bold focus:ring-2 focus:ring-indigo-500/40 outline-none"
					title="View Details"
					aria-label={`View details for ${answer.studentId.name}'s submission`}
				>
					<HiEye aria-hidden="true" />
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
			Students haven&apos;t completed this quiz yet. Share the quiz ID with your
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
									<th
										scope="col"
										className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16"
									>
										#
									</th>
									<th
										scope="col"
										className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
									>
										Student
									</th>
									<th
										scope="col"
										className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
									>
										Score
									</th>
									<th
										scope="col"
										className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
									>
										Status
									</th>
									<th
										scope="col"
										className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
									>
										Date
									</th>
									<th
										scope="col"
										className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
									>
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
