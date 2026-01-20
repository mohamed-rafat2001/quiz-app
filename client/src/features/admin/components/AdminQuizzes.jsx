import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminQuizzes, useDeleteQuizAdmin } from "../hooks/useAdmin";
import {
	HiTrash,
	HiEye,
	HiAcademicCap,
	HiMagnifyingGlass,
	HiClipboardDocumentList,
	HiUsers,
	HiChartBar,
	HiArrowPath,
	HiCheckBadge,
	HiClock,
} from "react-icons/hi2";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, color }) => (
	<div className={`p-5 rounded-2xl bg-gradient-to-br ${color} text-white`}>
		<Icon className="text-3xl mb-2 opacity-80" />
		<p className="text-3xl font-black">{value}</p>
		<p className="text-sm opacity-80">{title}</p>
	</div>
);

export default function AdminQuizzes() {
	const { data: quizzes, isLoading, refetch } = useAdminQuizzes();
	const { mutate: deleteQuiz, isPending: isDeleting } = useDeleteQuizAdmin();
	const [searchTerm, setSearchTerm] = useState("");

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	// Filter quizzes
	const filteredQuizzes =
		quizzes?.filter((quiz) => {
			const matchesSearch =
				quiz.quizName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				quiz.teacherId?.name
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				quiz.teacherId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
			return matchesSearch;
		}) || [];

	// Calculate stats
	const totalQuizzes = quizzes?.length || 0;
	const totalQuestions =
		quizzes?.reduce((sum, q) => sum + (q.questions?.length || 0), 0) || 0;
	const avgQuestions =
		totalQuizzes > 0 ? Math.round(totalQuestions / totalQuizzes) : 0;
	const avgSuccessRate =
		totalQuizzes > 0
			? Math.round(
					quizzes.reduce((sum, q) => sum + (q.successRate || 0), 0) /
						totalQuizzes
			  )
			: 0;

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
			>
				<div>
					<h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
						Quiz Management
					</h1>
					<p className="text-gray-500 dark:text-gray-400 mt-1">
						Monitor and manage all quizzes on the platform
					</p>
				</div>
				<button
					onClick={() => refetch()}
					className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all"
				>
					<HiArrowPath className={isLoading ? "animate-spin" : ""} />
					Refresh
				</button>
			</motion.div>

			{/* Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="grid grid-cols-2 lg:grid-cols-4 gap-4"
			>
				<StatCard
					title="Total Quizzes"
					value={totalQuizzes}
					icon={HiClipboardDocumentList}
					color="from-indigo-500 to-purple-500"
				/>
				<StatCard
					title="Total Questions"
					value={totalQuestions}
					icon={HiAcademicCap}
					color="from-blue-500 to-cyan-500"
				/>
				<StatCard
					title="Avg Questions/Quiz"
					value={avgQuestions}
					icon={HiChartBar}
					color="from-purple-500 to-pink-500"
				/>
				<StatCard
					title="Avg Success Rate"
					value={`${avgSuccessRate}%`}
					icon={HiCheckBadge}
					color="from-green-500 to-emerald-500"
				/>
			</motion.div>

			{/* Search */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className="relative">
					<label htmlFor="admin-search-quizzes" className="sr-only">
						Search quizzes by name or teacher
					</label>
					<HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						id="admin-search-quizzes"
						type="text"
						name="admin-search-quizzes"
						autoComplete="off"
						placeholder="Search quizzes by name or teacher..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
					/>
				</div>
			</motion.div>

			{/* Quizzes Grid */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
			>
				<AnimatePresence>
					{filteredQuizzes.map((quiz, index) => (
						<motion.div
							key={quiz._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ delay: index * 0.05 }}
							className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all group"
						>
							{/* Quiz Header */}
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
										<HiAcademicCap className="text-2xl" />
									</div>
									<div>
										<h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">
											{quiz.quizName}
										</h3>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{quiz.quizId}
										</p>
									</div>
								</div>
							</div>

							{/* Teacher Info */}
							<Link 
								to={`/app/users/${quiz.teacherId?._id}`}
								className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all group/teacher"
							>
								<div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm group-hover/teacher:scale-110 transition-transform">
									{quiz.teacherId?.name?.charAt(0) || "?"}
								</div>
								<div className="min-w-0">
									<p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover/teacher:text-indigo-600 dark:group-hover/teacher:text-indigo-400">
										{quiz.teacherId?.name || "Unknown"}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
										{quiz.teacherId?.email}
									</p>
								</div>
							</Link>

							{/* Quiz Stats */}
							<div className="grid grid-cols-3 gap-2 mb-4">
								<div className="text-center p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
									<p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
										{quiz.questions?.length || 0}
									</p>
									<p className="text-xs text-indigo-700 dark:text-indigo-500">
										Questions
									</p>
								</div>
								<div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
									<p className="text-lg font-bold text-green-600 dark:text-green-400">
										{Math.round(quiz.successRate || 0)}%
									</p>
									<p className="text-xs text-green-700 dark:text-green-500">
										Success
									</p>
								</div>
								<div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
									<p className="text-lg font-bold text-orange-600 dark:text-orange-400">
										{quiz.expire || 0}
									</p>
									<p className="text-xs text-orange-700 dark:text-orange-500">
										{quiz.expireUnit === "hours" ? "hrs" : "min"}
									</p>
								</div>
							</div>

							{/* Actions */}
							<div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
								<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
									<HiClock />
									{quiz.createdAt
										? new Date(quiz.createdAt).toLocaleDateString()
										: "N/A"}
								</div>
								<div className="flex items-center gap-2">
									<Link
										to={`/app/quizzes/submissions/${quiz._id}`}
										className="p-2 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 transition-all"
										title="View Submissions"
									>
										<HiEye />
									</Link>
									<button
										onClick={() => {
											if (
												window.confirm(
													"Are you sure you want to delete this quiz?"
												)
											) {
												deleteQuiz(quiz._id);
											}
										}}
										disabled={isDeleting}
										className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 transition-all"
										title="Delete Quiz"
									>
										<HiTrash />
									</button>
								</div>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</motion.div>

			{filteredQuizzes.length === 0 && (
				<div className="py-12 text-center text-gray-500 dark:text-gray-400">
					<HiClipboardDocumentList className="text-5xl mx-auto mb-4 opacity-50" />
					<p>No quizzes found matching your search.</p>
				</div>
			)}

			{/* Table View for larger screens */}
			{filteredQuizzes.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="hidden xl:block bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
				>
					<div className="p-5 border-b border-gray-100 dark:border-gray-700">
						<h3 className="text-lg font-bold text-gray-900 dark:text-white">
							All Quizzes - Table View
						</h3>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 dark:bg-gray-700/30">
								<tr>
									<th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
										Quiz
									</th>
									<th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
										Teacher
									</th>
									<th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
										Questions
									</th>
									<th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
										Time
									</th>
									<th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
										Success
									</th>
									<th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100 dark:divide-gray-700">
								{filteredQuizzes.map((quiz) => (
									<tr
										key={quiz._id}
										className="hover:bg-gray-50 dark:hover:bg-gray-700/20"
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
													<HiAcademicCap />
												</div>
												<div>
													<p className="font-bold text-gray-900 dark:text-white">
														{quiz.quizName}
													</p>
													<p className="text-xs text-gray-500 dark:text-gray-400">
														{quiz.quizId}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<p className="font-medium text-gray-900 dark:text-white">
												{quiz.teacherId?.name}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{quiz.teacherId?.email}
											</p>
										</td>
										<td className="px-6 py-4 text-center font-bold text-gray-700 dark:text-gray-300">
											{quiz.questions?.length || 0}
										</td>
										<td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">
											{quiz.expire}{" "}
											{quiz.expireUnit === "hours" ? "hrs" : "min"}
										</td>
										<td className="px-6 py-4 text-center">
											<span
												className={`px-3 py-1 rounded-lg text-sm font-bold ${
													(quiz.successRate || 0) >= 70
														? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
														: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
												}`}
											>
												{Math.round(quiz.successRate || 0)}%
											</span>
										</td>
										<td className="px-6 py-4 text-right">
											<div className="flex items-center justify-end gap-2">
												<Link
													to={`/app/quizzes/submissions/${quiz._id}`}
													className="p-2 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 transition-all"
												>
													<HiEye />
												</Link>
												<button
													onClick={() => {
														if (window.confirm("Delete this quiz?")) {
															deleteQuiz(quiz._id);
														}
													}}
													className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 transition-all"
												>
													<HiTrash />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</motion.div>
			)}
		</div>
	);
}
