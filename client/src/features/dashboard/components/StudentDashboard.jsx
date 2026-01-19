import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import StatCard from "./StatCard";
import {
	HiClipboardDocumentList,
	HiCheckBadge,
	HiXCircle,
	HiChartBar,
	HiPlay,
	HiRocketLaunch,
	HiArrowTrendingUp,
} from "react-icons/hi2";

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

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

		{/* Performance Trend Chart */}
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.1 }}
			className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700"
		>
			<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
				<HiArrowTrendingUp className="text-indigo-500" />
				Your Performance Trend
			</h3>
			<div className="h-[300px] w-full relative">
				<ResponsiveContainer width="100%" height="100%" minWidth={0}>
					<AreaChart data={stats?.scoreTrend || []}>
						<defs>
							<linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
								<stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
							</linearGradient>
						</defs>
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
						<Area
							type="monotone"
							dataKey="score"
							stroke="#6366f1"
							strokeWidth={3}
							fillOpacity={1}
							fill="url(#colorScore)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
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
				className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700"
			>
				<HiClipboardDocumentList className="text-4xl text-indigo-500 mb-4" />
				<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
					My Results
				</h3>
				<p className="text-gray-500 dark:text-gray-400 mb-4">
					Review your past quiz attempts and scores
				</p>
				<Link
					to="/app/my-submissions"
					className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
				>
					View All Results
				</Link>
			</motion.div>
		</div>
	</div>
);

export default StudentDashboard;
