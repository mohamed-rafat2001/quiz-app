import { useState, useEffect } from "react";
import { useStats, useTeacherQuizStats } from "../hooks/useDashboard";
import { useUser } from "../../auth/hooks/useAuth";
import { Link } from "react-router-dom";
import {
	HiUsers,
	HiAcademicCap,
	HiClipboardDocumentList,
	HiCheckBadge,
	HiXCircle,
	HiChartBar,
	HiPlus,
	HiPlay,
	HiMagnifyingGlass,
	HiArrowTrendingUp,
	HiTrophy,
	HiClock,
} from "react-icons/hi2";
import toast from "react-hot-toast";

const StatCard = ({ title, value, icon: Icon, color }) => (
	<div className="bg-white dark:bg-white/[0.03] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:-translate-y-1 transition-all duration-300">
		<div className="flex items-center gap-4">
			<div
				className={`p-4 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20`}
			>
				<Icon className={`text-2xl ${color.replace("bg-", "text-")}`} />
			</div>
			<div>
				<p className="text-sm font-black text-gray-600 dark:text-gray-400">
					{title}
				</p>
				<h3 className="text-2xl font-black text-gray-900 dark:text-white">
					{value}
				</h3>
			</div>
		</div>
	</div>
);

const QuizStatsTable = ({ quizzes, isLoading, searchTerm, onSearchChange }) => {
	return (
		<div className="bg-white dark:bg-white/[0.03] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden transition-colors duration-300">
			<div className="p-8 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h3 className="text-xl font-black text-gray-900 dark:text-white">
						Quiz Performance
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-black">
						Detailed statistics for each of your quizzes
					</p>
				</div>
				<div className="relative">
					<HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
					<input
						type="text"
						placeholder="Search by name or ID..."
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-12 pr-6 py-3 bg-gray-50 dark:bg-white/[0.05] border border-gray-100 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full md:w-80 transition-all dark:text-white"
					/>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="bg-gray-50/50 dark:bg-white/[0.02]">
							<th className="px-8 py-4 text-left text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
								Quiz Name
							</th>
							<th className="px-8 py-4 text-left text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
								Students
							</th>
							<th className="px-8 py-4 text-left text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
								Avg. Score
							</th>
							<th className="px-8 py-4 text-left text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
								Success Rate
							</th>
							<th className="px-8 py-4 text-left text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
								High Score
							</th>
							<th className="px-8 py-4 text-right text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100 dark:divide-white/5">
						{isLoading ? (
							<tr>
								<td colSpan="6" className="px-8 py-12 text-center">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
								</td>
							</tr>
						) : quizzes?.length > 0 ? (
							quizzes.map((quiz) => (
								<tr
									key={quiz._id}
									className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
								>
									<td className="px-8 py-5">
										<div className="flex flex-col">
											<span className="font-bold text-gray-900 dark:text-white">
												{quiz.quizName}
											</span>
											<div className="flex items-center gap-2 mt-1">
												<span className="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded">
													{quiz.quizId}
												</span>
												<button
													onClick={() => {
														navigator.clipboard.writeText(quiz.quizId);
														toast.success("ID copied!");
													}}
													className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
												>
													Copy
												</button>
											</div>
										</div>
									</td>
									<td className="px-8 py-5">
										<div className="flex items-center gap-2">
											<HiUsers className="text-gray-400" />
											<span className="font-bold text-gray-700 dark:text-gray-300">
												{quiz.stats.totalAttempts}
											</span>
										</div>
									</td>
									<td className="px-8 py-5">
										<div className="flex items-center gap-2">
											<HiArrowTrendingUp className="text-indigo-500" />
											<span className="font-bold text-gray-700 dark:text-gray-300">
												{Math.round(quiz.stats.avgScore)}%
											</span>
										</div>
									</td>
									<td className="px-8 py-5">
										<div className="flex items-center gap-3">
											<div className="flex-1 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden max-w-[60px]">
												<div
													className={`h-full rounded-full ${
														quiz.stats.successRate > 70
															? "bg-green-500"
															: quiz.stats.successRate > 40
															? "bg-yellow-500"
															: "bg-red-500"
													}`}
													style={{ width: `${quiz.stats.successRate}%` }}
												/>
											</div>
											<span className="font-bold text-gray-700 dark:text-gray-300 text-sm">
												{Math.round(quiz.stats.successRate)}%
											</span>
										</div>
									</td>
									<td className="px-8 py-5">
										<div className="flex items-center gap-2">
											<HiTrophy className="text-yellow-500" />
											<span className="font-bold text-gray-700 dark:text-gray-300">
												{quiz.stats.highestScore}%
											</span>
										</div>
									</td>
									<td className="px-8 py-5 text-right">
										<Link
											to={`/app/quizzes/submissions/${quiz._id}`}
											className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all"
										>
											Details
										</Link>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan="6"
									className="px-8 py-12 text-center text-gray-500"
								>
									No quizzes found matching your search.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

const DashboardHeader = ({ user, role }) => (
	<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
				Dashboard
			</h1>
			<p className="text-gray-500 dark:text-gray-400 mt-2">
				Welcome back, {user?.name}! Here&apos;s what&apos;s happening.
			</p>
		</div>
		{role === "teacher" && (
			<Link
				to="/app/quizzes/create"
				className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-indigo-950/20 transition-all"
			>
				<HiPlus className="text-xl" />
				<span>Create Quiz</span>
			</Link>
		)}
		{role === "student" && (
			<Link
				to="/app/home"
				className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-indigo-950/20 transition-all"
			>
				<HiPlay className="text-xl" />
				<span>Take a Quiz</span>
			</Link>
		)}
	</div>
);

const StatsGrid = ({ role, stats }) => (
	<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{role === "admin" && (
			<>
				<StatCard
					title="Total Students"
					value={stats?.totalStudents}
					icon={HiUsers}
					color="bg-blue-500"
				/>
				<StatCard
					title="Total Teachers"
					value={stats?.totalTeachers}
					icon={HiAcademicCap}
					color="bg-indigo-500"
				/>
				<StatCard
					title="Total Quizzes"
					value={stats?.totalQuizzes}
					icon={HiClipboardDocumentList}
					color="bg-purple-500"
				/>
				<StatCard
					title="Total Submissions"
					value={stats?.totalResults}
					icon={HiCheckBadge}
					color="bg-green-500"
				/>
			</>
		)}

		{role === "teacher" && (
			<>
				<StatCard
					title="My Quizzes"
					value={stats?.totalQuizzes}
					icon={HiClipboardDocumentList}
					color="bg-indigo-500"
				/>
				<StatCard
					title="Total Submissions"
					value={stats?.totalSubmissions}
					icon={HiUsers}
					color="bg-blue-500"
				/>
				<StatCard
					title="Avg Success Rate"
					value={`${Math.round(stats?.avgSuccessRate || 0)}%`}
					icon={HiChartBar}
					color="bg-green-500"
				/>
			</>
		)}

		{role === "student" && (
			<>
				<StatCard
					title="Quizzes Taken"
					value={stats?.totalTaken}
					icon={HiClipboardDocumentList}
					color="bg-indigo-500"
				/>
				<StatCard
					title="Passed"
					value={stats?.passedCount}
					icon={HiCheckBadge}
					color="bg-green-500"
				/>
				<StatCard
					title="Failed"
					value={stats?.failedCount}
					icon={HiXCircle}
					color="bg-red-500"
				/>
				<StatCard
					title="Average Score"
					value={`${Math.round(stats?.avgScore || 0)}%`}
					icon={HiChartBar}
					color="bg-blue-500"
				/>
			</>
		)}
	</div>
);

const QuickActions = ({ role }) => (
	<div className="bg-white dark:bg-white/[0.03] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm transition-colors duration-300">
		<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
			Quick Actions
		</h3>
		<div className="grid grid-cols-2 gap-4">
			<Link
				to="/app/profile"
				className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
			>
				<p className="font-bold dark:text-gray-200 mb-1">Update Profile</p>
				<p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-indigo-400">
					Manage your settings
				</p>
			</Link>
			{role !== "admin" && (
				<Link
					to="/app/quizzes"
					className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
				>
					<p className="font-bold dark:text-gray-200 mb-1">
						{role === "teacher" ? "Manage Quizzes" : "Browse Quizzes"}
					</p>
					<p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-indigo-400">
						View all available
					</p>
				</Link>
			)}
			{role === "student" && (
				<Link
					to="/app/my-submissions"
					className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
				>
					<p className="font-bold dark:text-gray-200 mb-1">My Results</p>
					<p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-indigo-400">
						Check your scores
					</p>
				</Link>
			)}
		</div>
	</div>
);

const TipCard = ({ role }) => (
	<div className="bg-white dark:bg-white/[0.03] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col justify-center items-center text-center transition-colors duration-300">
		<div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
			<HiAcademicCap className="text-3xl" />
		</div>
		<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
			{role === "teacher" ? "Teaching Tip" : "Learning Tip"}
		</h3>
		<p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs font-black">
			{role === "teacher"
				? "Clear and concise questions help students focus on the core concepts being tested."
				: "Reviewing your previous answers is a great way to identify areas where you can improve."}
		</p>
	</div>
);

export default function DashBoard() {
	const { data: user } = useUser();
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	// Debounce search term
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchTerm);
		}, 500);
		return () => clearTimeout(timer);
	}, [searchTerm]);

	const { data: stats, isLoading } = useStats();
	const { data: teacherQuizzes, isLoading: isLoadingQuizzes } =
		useTeacherQuizStats({ keyword: debouncedSearch });

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	const role = user?.role;

	return (
		<div className="space-y-8">
			<DashboardHeader user={user} role={role} />
			<StatsGrid role={role} stats={stats} />

			{role === "teacher" && (
				<QuizStatsTable
					quizzes={teacherQuizzes}
					isLoading={isLoadingQuizzes}
					searchTerm={searchTerm}
					onSearchChange={setSearchTerm}
				/>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<QuickActions role={role} />
				<TipCard role={role} />
			</div>
		</div>
	);
}
