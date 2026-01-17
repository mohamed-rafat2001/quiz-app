import { motion } from "framer-motion";

export default function Loader({ fullPage = true }) {
	const containerClasses = fullPage
		? "fixed inset-0 bg-white/80 dark:bg-[#0b0f1a]/80 backdrop-blur-md z-[9999]"
		: "relative py-20 bg-transparent";

	return (
		<div className={`${containerClasses} flex flex-col items-center justify-center overflow-hidden transition-colors duration-300`}>
			{/* Animated Background Elements - Only for full page */}
			{fullPage && (
				<motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{
						opacity: [0.1, 0.3, 0.1],
						scale: [1, 1.2, 1],
						rotate: [0, 90, 0],
					}}
					transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
					className="absolute w-[500px] h-[500px] bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl -z-10"
				/>
			)}

			<div className="relative">
				{/* Main Spinner */}
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
					className={`border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 dark:border-t-indigo-500 rounded-full ${
						fullPage ? "w-20 h-20" : "w-12 h-12"
					}`}
				/>

				{/* Inner Pulse */}
				<motion.div
					initial={{ scale: 0.8, opacity: 0.5 }}
					animate={{ scale: 1.2, opacity: 0 }}
					transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
					className="absolute inset-0 bg-indigo-600 dark:bg-indigo-500 rounded-full"
				/>

				{/* Center Icon/Letter */}
				<div className="absolute inset-0 flex items-center justify-center">
					<motion.span
						initial={{ scale: 0.5, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className={`text-indigo-600 dark:text-indigo-400 font-black ${
							fullPage ? "text-2xl" : "text-sm"
						}`}
					>
						Q
					</motion.span>
				</div>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				className="mt-8 text-center"
			>
				<div className="flex items-center justify-center gap-1">
					{[0, 1, 2].map((i) => (
						<motion.div
							key={i}
							animate={{
								scale: [1, 1.5, 1],
								opacity: [0.3, 1, 0.3],
							}}
							transition={{
								duration: 1,
								repeat: Infinity,
								delay: i * 0.2,
							}}
							className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-500 rounded-full"
						/>
					))}
				</div>
			</motion.div>
		</div>
	);
}
