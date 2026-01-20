import { useMemo } from "react";
import {
	HiUsers,
	HiCheckBadge,
	HiXCircle,
	HiChartBar,
	HiTrophy,
	HiClipboardDocumentList,
} from "react-icons/hi2";

const StatCard = ({
	title,
	value,
	icon: Icon,
	color,
	subtitle,
	onClick,
	isActive,
}) => {
	const CardWrapper = onClick ? "button" : "div";

	return (
		<CardWrapper
			onClick={onClick}
			type={onClick ? "button" : undefined}
			className={`bg-white dark:bg-gray-800/50 p-5 rounded-xl border transition-all duration-200 shadow-sm text-left w-full ${
				onClick ? "cursor-pointer hover:shadow-md focus:ring-2 focus:ring-indigo-500/40 outline-none" : ""
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
					<Icon
						className={`text-xl ${color.replace("bg-", "text-")}`}
						aria-hidden="true"
					/>
				</div>
				<div>
					<p className="text-xs font-medium text-gray-500 dark:text-gray-400">
						{title}
					</p>
					<p className="text-xl font-black text-gray-900 dark:text-white">
						{value}
					</p>
					{subtitle && (
						<p className="text-xs text-gray-400 dark:text-gray-500">
							{subtitle}
						</p>
					)}
				</div>
			</div>
		</CardWrapper>
	);
};

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

export default StatsOverview;
