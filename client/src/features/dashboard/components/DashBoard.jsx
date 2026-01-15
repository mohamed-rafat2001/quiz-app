import { useStats } from "../hooks/useDashboard";
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
} from "react-icons/hi2";

const StatCard = ({ title, value, icon: Icon, color }) => (
	<div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:-translate-y-1 transition-all duration-300">
		<div className="flex items-center gap-4">
			<div className={`p-4 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
				<Icon className={`text-2xl ${color.replace("bg-", "text-")}`} />
			</div>
			<div>
				<p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
				<h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
			</div>
		</div>
	</div>
);

const DashboardHeader = ({ user, role }) => (
	<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
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
	<div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
		<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
		<div className="grid grid-cols-2 gap-4">
			<Link
				to="/app/profile"
				className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
			>
				<p className="font-bold dark:text-gray-200 mb-1">Update Profile</p>
				<p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-indigo-400">
					Manage your settings
				</p>
			</Link>
			{role !== "admin" && (
				<Link
					to="/app/quizzes"
					className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
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
					className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
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
	<div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center items-center text-center transition-colors duration-300">
		<div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
			<HiAcademicCap className="text-3xl" />
		</div>
		<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
			{role === "teacher" ? "Teaching Tip" : "Learning Tip"}
		</h3>
		<p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
			{role === "teacher"
				? "Clear and concise questions help students focus on the core concepts being tested."
				: "Reviewing your previous answers is a great way to identify areas where you can improve."}
		</p>
	</div>
);

export default function DashBoard() {
	const { data: user } = useUser();
	const { data: stats, isLoading } = useStats();

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

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<QuickActions role={role} />
				<TipCard role={role} />
			</div>
		</div>
	);
}
