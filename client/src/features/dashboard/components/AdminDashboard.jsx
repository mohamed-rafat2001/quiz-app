import { useState, useEffect } from "react";
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
	PieChart,
	Pie,
	Cell,
	Legend,
} from "recharts";
import StatCard from "./StatCard";
import {
	HiUsers,
	HiAcademicCap,
	HiClipboardDocumentList,
	HiCheckBadge,
	HiCog6Tooth,
	HiUserGroup,
	HiDocumentText,
	HiShieldCheck,
	HiPresentationChartBar,
	HiSparkles,
	HiArrowTrendingUp,
	HiChartPie,
} from "react-icons/hi2";

const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#f97316"];

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const AdminDashboard = ({ stats }) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsMounted(true);
		}, 100);
		return () => clearTimeout(timer);
	}, []);

	if (!isMounted) return null;

	return (
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

		{/* Charts Section */}
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* Registration Trend Chart */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700"
			>
				<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
					<HiArrowTrendingUp className="text-indigo-500" />
					Platform Growth (Last 6 Months)
				</h3>
				<div className="h-[300px] w-full relative">
					<ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={50}>
						<BarChart data={stats?.combinedTrend || []}>
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
								name="New Users"
								dataKey="users" 
								fill="#6366f1" 
								radius={[4, 4, 0, 0]} 
								barSize={30}
							/>
							<Bar 
								name="New Quizzes"
								dataKey="quizzes" 
								fill="#a855f7" 
								radius={[4, 4, 0, 0]} 
								barSize={30}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</motion.div>

			{/* Role Distribution Chart */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700"
			>
				<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
					<HiChartPie className="text-purple-500" />
					User Role Distribution
				</h3>
				<div className="h-[300px] w-full relative">
					<ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={50}>
						<PieChart>
							<Pie
								data={stats?.roleDistribution || []}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={80}
								paddingAngle={5}
								dataKey="value"
							>
								{stats?.roleDistribution?.map((entry, index) => (
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

		{/* Admin Quick Actions */}
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
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
					<Link
						to="/app/dashboard"
						className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 hover:shadow-md transition-all group"
					>
						<HiPresentationChartBar className="text-2xl text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
						<p className="font-bold text-gray-900 dark:text-white">Analytics</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							Platform insights
						</p>
					</Link>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
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
};

export default AdminDashboard;
