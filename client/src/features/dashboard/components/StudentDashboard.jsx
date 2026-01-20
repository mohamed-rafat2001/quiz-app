import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
	HiTrophy,
	HiClock,
	HiArrowTrendingUp,
} from "react-icons/hi2";

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const StudentDashboard = ({ stats }) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsMounted(true);
		}, 500);
		return () => clearTimeout(timer);
	}, []);

	if (!isMounted) return null;

	return (
		<div className="space-y-6">
			{/* Student Stats Grid */}
			<motion.div
				variants={staggerContainer}
				initial="hidden"
				animate="visible"
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
			>
				<StatCard
					title="Quizzes Taken"
					value={stats?.quizzesTaken || 0}
					icon={HiClipboardDocumentList}
					color="from-indigo-500 to-purple-500"
				/>
				<StatCard
					title="Avg Score"
					value={`${Math.round(stats?.avgScore || 0)}%`}
					icon={HiCheckBadge}
					color="from-blue-500 to-cyan-500"
				/>
				<StatCard
					title="Best Score"
					value={`${stats?.bestScore || 0}%`}
					icon={HiTrophy}
					color="from-orange-500 to-red-500"
				/>
				<StatCard
					title="Total Time"
					value={`${stats?.totalTimeSpent || 0}m`}
					icon={HiClock}
					color="from-green-500 to-emerald-500"
				/>
			</motion.div>

			{/* Score Trend Chart */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700"
			>
				<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
					<HiArrowTrendingUp className="text-indigo-500" />
					Your Performance Trend
				</h3>
				<div className="h-[300px] w-full relative min-h-[300px]">
					{isMounted && (
						<ResponsiveContainer width="100%" height="100%" debounce={100}>
						<AreaChart data={stats?.scoreTrend || []}>
							<defs>
								<linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
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
								fill="url(#scoreGradient)"
							/>
						</AreaChart>
					</ResponsiveContainer>
					)}
				</div>
			</motion.div>
		</div>
	);
};

export default StudentDashboard;
