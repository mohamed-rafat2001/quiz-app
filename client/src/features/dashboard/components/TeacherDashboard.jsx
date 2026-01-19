import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import StatCard from "./StatCard";
import Pagination from "../../../shared/components/ui/Pagination";
import {
	HiClipboardDocumentList,
	HiUsers,
	HiRocketLaunch,
	HiPlus,
	HiEye,
	HiMagnifyingGlass,
	HiChartBar,
	HiChartPie,
	HiCheckBadge,
	HiArrowTrendingUp,
} from "react-icons/hi2";

const COLORS = ["#10b981", "#ef4444"];

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

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
				title="Avg Success Rate"
				value={`${Math.round(stats?.avgSuccessRate || 0)}%`}
				icon={HiCheckBadge}
				color="from-orange-500 to-red-500"
			/>
		</motion.div>

		{/* Charts Section */}
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700"
			>
				<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
					<HiArrowTrendingUp className="text-indigo-500" />
					Recent Quizzes Performance
				</h3>
				<div className="h-[300px] w-full relative">
					<ResponsiveContainer width="100%" height="100%" minWidth={0}>
						<BarChart data={stats?.quizPerformance || []}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
							<XAxis 
								dataKey="name" 
								axisLine={false}
								tickLine={false}
								tick={{ fill: '#9CA3AF', fontSize: 12 }}
							/>
							<YAxis 
								axisLine={false}
								tickLine={false}
								tick={{ fill: '#9CA3AF', fontSize: 12 }}
							/>
							<Tooltip 
								contentStyle={{ 
									backgroundColor: '#FFF', 
									borderRadius: '12px', 
									border: 'none',
									boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
								}}
							/>
							<Legend verticalAlign="top" align="right" iconType="circle" />
							<Bar 
								name="Avg Score (%)"
								dataKey="avgScore" 
								fill="#6366f1" 
								radius={[4, 4, 0, 0]} 
								barSize={30}
							/>
							<Bar 
								name="Attempts"
								dataKey="attempts" 
								fill="#a855f7" 
								radius={[4, 4, 0, 0]} 
								barSize={30}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700"
			>
				<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
					<HiChartPie className="text-emerald-500" />
					Overall Pass/Fail Ratio
				</h3>
				<div className="h-[300px] w-full relative">
					<ResponsiveContainer width="100%" height="100%" minWidth={0}>
						<PieChart>
							<Pie
								data={stats?.passFailData || []}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={80}
								paddingAngle={5}
								dataKey="value"
							>
								{stats?.passFailData?.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
								))}
							</Pie>
							<Tooltip 
								contentStyle={{ 
									backgroundColor: '#FFF', 
									borderRadius: '12px', 
									border: 'none',
									boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
								}}
							/>
							<Legend verticalAlign="bottom" height={36}/>
						</PieChart>
					</ResponsiveContainer>
				</div>
			</motion.div>
		</div>

		{/* Create Quiz CTA */}
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
		>
			<div className="text-white">
				<h3 className="text-xl font-bold mb-1">Ready to create a new quiz?</h3>
				<p className="text-indigo-100">
					Start engaging your students with interactive quizzes.
				</p>
			</div>
			<Link
				to="/app/quizzes/create"
				className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
			>
				<HiPlus className="text-xl" />
				Create Quiz
			</Link>
		</motion.div>

		{/* Recent Quizzes */}
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
			className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700"
		>
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
				<h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
					<HiClipboardDocumentList className="text-indigo-500" />
					Recent Quizzes
				</h3>
				<div className="relative">
					<HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search quizzes..."
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white w-full sm:w-64"
					/>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full">
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

export default TeacherDashboard;
