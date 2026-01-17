import { motion } from "framer-motion";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";

const fadeInUp = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

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

export default StatCard;
