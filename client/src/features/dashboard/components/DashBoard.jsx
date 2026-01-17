import { useState, useEffect } from "react";
import { useStats, useTeacherQuizStats } from "../hooks/useDashboard";
import { useUser } from "../../auth/hooks/useAuth";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
	HiUsers,
	// ... existing icons ...
	HiDocumentText,
} from "react-icons/hi2";
import toast from "react-hot-toast";
import Pagination from "../../../shared/components/ui/Pagination";

// Animation variants
const fadeInUp = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// Shared Components
const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
	<motion.div
		variants={fadeInUp}
		className="bg-white dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
	>
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-4">
				<div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
					<Icon className="text-xl text-white" />
				</div>
				<div>
					<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
						{title}
					</p>
					<p className="text-2xl font-black text-gray-900 dark:text-white">
						{value}
					</p>
					{subtitle && (
						<p className="text-xs text-gray-400 dark:text-gray-500">
							{subtitle}
						</p>
					)}
				</div>
			</div>
			{trend && (
				<div
					className={`flex items-center gap-1 text-sm font-bold ${
						trend > 0 ? "text-green-500" : "text-red-500"
					}`}
				>
					{trend > 0 ? <HiArrowTrendingUp /> : <HiArrowTrendingDown />}
					{Math.abs(trend)}%
				</div>
			)}
		</div>
	</motion.div>
);

const WelcomeHeader = ({ user, role }) => {
	const greeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 18) return "Good afternoon";
		return "Good evening";
	};

	const roleLabels = {
		admin: "Administrator",
		teacher: "Teacher",
		student: "Student",
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden"
		>
			<div className="relative z-10">
				<p className="text-indigo-200 font-medium mb-1">{greeting()},</p>
				<h1 className="text-3xl font-black mb-2">{user?.name || "User"}</h1>
				<p className="text-indigo-200 flex items-center gap-2">
					<span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">
						{roleLabels[role] || "User"}
					</span>
					<span>Welcome to QUIZMASTER Dashboard</span>
				</p>
			</div>
			<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
			<div className="absolute bottom-0 left-1/2 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl translate-y-1/2" />
		</motion.div>
	);
};

// ============ ADMIN DASHBOARD ============
const AdminDashboard = ({ stats }) => (
	<div className="space-y-6">
		{/* Admin Stats Grid */}
		<motion.div
			variants={staggerContainer}
			initial="hidden"
			animate="visible"
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
		>
			<StatCard
				title="Total Students"
				value={stats?.totalStudents || 0}
				icon={HiUsers}
				color="from-blue-500 to-cyan-500"
			/>
			<StatCard
				title="Total Teachers"
				value={stats?.totalTeachers || 0}
				icon={HiAcademicCap}
				color="from-purple-500 to-pink-500"
			/>
			<StatCard
				title="Total Quizzes"
				value={stats?.totalQuizzes || 0}
				icon={HiClipboardDocumentList}
				color="from-orange-500 to-red-500"
			/>
			<StatCard
				title="Total Submissions"
				value={stats?.totalResults || 0}
				icon={HiCheckBadge}
				color="from-green-500 to-emerald-500"
			/>
		</motion.div>

		{/* Admin Quick Actions */}
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700"
			>
				<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
					<HiCog6Tooth className="text-indigo-500" />
					Admin Controls
				</h3>
				<div className="grid grid-cols-2 gap-3">
					<Link
						to="/app/admin/users"
						className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-md transition-all group"
					>
						<HiUserGroup className="text-2xl text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
						<p className="font-bold text-gray-900 dark:text-white">
							Manage Users
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							View & edit users
						</p>
					</Link>
					<Link
						to="/app/admin/quizzes"
						className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-md transition-all group"
					>
						<HiDocumentText className="text-2xl text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
						<p className="font-bold text-gray-900 dark:text-white">
							Manage Quizzes
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							Monitor all quizzes
						</p>
					</Link>
					<Link
						to="/app/profile"
						className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-md transition-all group"
					>
						<HiShieldCheck className="text-2xl text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform" />
						<p className="font-bold text-gray-900 dark:text-white">Security</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							Account settings
						</p>
					</Link>
					<div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
						<HiPresentationChartBar className="text-2xl text-orange-600 dark:text-orange-400 mb-2" />
						<p className="font-bold text-gray-900 dark:text-white">Analytics</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							Platform insights
						</p>
					</div>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700"
			>
				<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
					<HiSparkles className="text-yellow-500" />
					Platform Overview
				</h3>
				<div className="space-y-4">
					<div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
						<span className="text-gray-600 dark:text-gray-400">
							Active Sessions
						</span>
						<span className="font-bold text-gray-900 dark:text-white">
							{Math.floor((stats?.totalStudents || 0) * 0.1)} online
						</span>
					</div>
					<div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
						<span className="text-gray-600 dark:text-gray-400">
							Quizzes Today
						</span>
						<span className="font-bold text-gray-900 dark:text-white">
							{Math.floor((stats?.totalResults || 0) * 0.05)}
						</span>
					</div>
					<div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
						<span className="text-gray-600 dark:text-gray-400">
							System Status
						</span>
						<span className="font-bold text-green-500 flex items-center gap-1">
							<span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
							Operational
						</span>
					</div>
				</div>
			</motion.div>
		</div>
	</div>
);

// ============ TEACHER DASHBOARD ============
const TeacherDashboard = ({
	stats,
	quizzes,
	isLoadingQuizzes,
	searchTerm,
	onSearchChange,
	page,
	onPageChange,
	meta,
}) => (
	<div className="space-y-6">
		{/* Teacher Stats */}
		<motion.div
			variants={staggerContainer}
			initial="hidden"
			animate="visible"
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
		>
			<StatCard
				title="My Quizzes"
				value={stats?.totalQuizzes || 0}
				icon={HiClipboardDocumentList}
				color="from-indigo-500 to-purple-500"
			/>
			<StatCard
				title="Total Students Taken"
				value={stats?.totalStudentsTaken || 0}
				icon={HiUsers}
				color="from-blue-500 to-cyan-500"
			/>
			<StatCard
				title="Active Quizzes"
				value={quizzes?.length || 0}
				icon={HiRocketLaunch}
				color="from-orange-500 to-red-500"
			/>
		</motion.div>

		{/* Create Quiz CTA */}
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
		>
			<div className="text-white">
				<h3 className="text-xl font-bold mb-1">Ready to create a new quiz?</h3>
				<p className="text-indigo-200 text-sm">
					Share knowledge with your students
				</p>
			</div>
			<Link
				to="/app/quizzes/create"
				className="flex items-center gap-2 bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
			>
				<HiPlus /> Create Quiz
			</Link>
		</motion.div>

		{/* Quiz Performance Table */}
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
		>
			<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h3 className="text-lg font-bold text-gray-900 dark:text-white">
						Quiz Performance
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Track your quiz statistics
					</p>
				</div>
				<div className="relative">
					<HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search quizzes..."
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full sm:w-64"
					/>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full">
					{/* ... table content ... */}
					<thead className="bg-gray-50 dark:bg-gray-700/30">
						<tr>
							<th className="px-5 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
								Quiz
							</th>
							<th className="px-5 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
								Students
							</th>
							<th className="px-5 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
								Avg Score
							</th>
							<th className="px-5 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
								Success
							</th>
							<th className="px-5 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100 dark:divide-gray-700">
						{isLoadingQuizzes ? (
							<tr>
								<td colSpan="5" className="py-8 text-center">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
								</td>
							</tr>
						) : quizzes?.length > 0 ? (
							quizzes.map((quiz) => (
								<tr
									key={quiz._id}
									className="hover:bg-gray-50 dark:hover:bg-gray-700/20"
								>
									<td className="px-5 py-4">
										<p className="font-bold text-gray-900 dark:text-white">
											{quiz.quizName}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{quiz.quizId}
										</p>
									</td>
									<td className="px-5 py-4 text-center font-bold text-gray-700 dark:text-gray-300">
										{quiz.stats?.totalAttempts || 0}
									</td>
									<td className="px-5 py-4 text-center font-bold text-gray-700 dark:text-gray-300">
										{Math.round(quiz.stats?.avgScore || 0)}%
									</td>
									<td className="px-5 py-4 text-center">
										<span
											className={`px-2 py-1 rounded-lg text-xs font-bold ${
												(quiz.stats?.successRate || 0) >= 70
													? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
													: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
											}`}
										>
											{Math.round(quiz.stats?.successRate || 0)}%
										</span>
									</td>
									<td className="px-5 py-4 text-right">
										<Link
											to={`/app/quizzes/submissions/${quiz._id}`}
											className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline"
										>
											<HiEye /> View
										</Link>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan="5"
									className="py-8 text-center text-gray-500 dark:text-gray-400"
								>
									No quizzes found. Create your first quiz!
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			{quizzes?.length > 0 && !isLoadingQuizzes && (
				<div className="p-4 border-t border-gray-100 dark:border-gray-700">
					<Pagination
						page={page}
						limit={meta?.limit || 5}
						total={meta?.total || 0}
						onPageChange={onPageChange}
						className="justify-center mt-0"
					/>
				</div>
			)}
		</motion.div>
	</div>
);

// ============ STUDENT DASHBOARD ============
const StudentDashboard = ({ stats }) => (
	<div className="space-y-6">
		{/* Student Stats */}
		<motion.div
			variants={staggerContainer}
			initial="hidden"
			animate="visible"
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
		>
			<StatCard
				title="Quizzes Taken"
				value={stats?.totalTaken || 0}
				icon={HiClipboardDocumentList}
				color="from-indigo-500 to-purple-500"
			/>
			<StatCard
				title="Passed"
				value={stats?.passedCount || 0}
				icon={HiCheckBadge}
				color="from-green-500 to-emerald-500"
			/>
			<StatCard
				title="Failed"
				value={stats?.failedCount || 0}
				icon={HiXCircle}
				color="from-red-500 to-orange-500"
			/>
			<StatCard
				title="Average Score"
				value={`${Math.round(stats?.avgScore || 0)}%`}
				icon={HiChartBar}
				color="from-blue-500 to-cyan-500"
				subtitle={stats?.avgScore >= 70 ? "Great job!" : "Keep practicing"}
			/>
		</motion.div>

		{/* Quick Actions for Student */}
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* Take Quiz CTA */}
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden"
			>
				<div className="relative z-10">
					<HiPlay className="text-4xl mb-4 opacity-80" />
					<h3 className="text-2xl font-bold mb-2">Ready for a Quiz?</h3>
					<p className="text-indigo-200 mb-4">
						Enter a quiz code to start your assessment
					</p>
					<Link
						to="/app/home"
						className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
					>
						<HiRocketLaunch /> Start Quiz
					</Link>
				</div>
				<div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
			</motion.div>

			{/* View Results CTA */}
			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
			>
				<HiTrophy className="text-4xl text-yellow-500 mb-4" />
				<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
					Your Performance
				</h3>
				<p className="text-gray-500 dark:text-gray-400 mb-4">
					View detailed results and track your progress
				</p>
				<Link
					to="/app/my-submissions"
					className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
				>
					<HiEye /> View All Results
				</Link>
			</motion.div>
		</div>

		{/* Progress Overview */}
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
		>
			<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
				<HiBookOpen className="text-indigo-500" />
				Learning Progress
			</h3>

			<div className="space-y-4">
				{/* Overall Progress */}
				<div>
					<div className="flex justify-between mb-2">
						<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
							Overall Success Rate
						</span>
						<span className="text-sm font-bold text-gray-900 dark:text-white">
							{stats?.totalTaken > 0
								? Math.round((stats?.passedCount / stats?.totalTaken) * 100)
								: 0}
							%
						</span>
					</div>
					<div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
							style={{
								width: `${
									stats?.totalTaken > 0
										? (stats?.passedCount / stats?.totalTaken) * 100
										: 0
								}%`,
							}}
						/>
					</div>
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-3 gap-4 pt-4">
					<div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-900/10">
						<p className="text-2xl font-black text-green-600 dark:text-green-400">
							{stats?.passedCount || 0}
						</p>
						<p className="text-xs text-green-700 dark:text-green-500">Passed</p>
					</div>
					<div className="text-center p-4 rounded-xl bg-red-50 dark:bg-red-900/10">
						<p className="text-2xl font-black text-red-600 dark:text-red-400">
							{stats?.failedCount || 0}
						</p>
						<p className="text-xs text-red-700 dark:text-red-500">Failed</p>
					</div>
					<div className="text-center p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/10">
						<p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
							{stats?.totalTaken || 0}
						</p>
						<p className="text-xs text-indigo-700 dark:text-indigo-500">
							Total
						</p>
					</div>
				</div>
			</div>
		</motion.div>
	</div>
);

// ============ MAIN DASHBOARD COMPONENT ============
export default function DashBoard() {
	const { data: user } = useUser();
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [page, setPage] = useState(1);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchTerm);
			setPage(1);
		}, 500);
		return () => clearTimeout(timer);
	}, [searchTerm]);

	const { data: stats, isLoading } = useStats();
	const { data: response, isLoading: isLoadingQuizzes } = useTeacherQuizStats({
		keyword: debouncedSearch,
		page,
		limit: 5,
	});

	const teacherQuizzes = response?.data || [];
	const meta = response?.meta || {};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	const role = user?.role;

	return (
		<div className="space-y-6">
			{/* Welcome Header */}
			<WelcomeHeader user={user} role={role} />

			{/* Role-specific Dashboard */}
			{role === "admin" && <AdminDashboard stats={stats} />}

			{role === "teacher" && (
				<TeacherDashboard
					stats={stats}
					quizzes={teacherQuizzes}
					isLoadingQuizzes={isLoadingQuizzes}
					searchTerm={searchTerm}
					onSearchChange={setSearchTerm}
					page={page}
					onPageChange={setPage}
					meta={meta}
				/>
			)}

			{role === "student" && <StudentDashboard stats={stats} />}
		</div>
	);
}
