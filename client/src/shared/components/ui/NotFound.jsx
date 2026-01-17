import { Link, useRouteError, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiHome, HiArrowLeft, HiExclamationTriangle } from "react-icons/hi2";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-white/[0.02] flex items-center justify-center p-6 transition-colors duration-300">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className="max-w-md w-full text-center"
			>
				<div className="relative mb-8 sm:mb-12">
					<motion.h1
						animate={{
							y: [0, -15, 0],
						}}
						transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
						className="text-[10rem] sm:text-[14rem] font-black text-indigo-100/50 dark:text-indigo-500/10 leading-none select-none tracking-tighter"
					>
						404
					</motion.h1>
					<div className="absolute inset-0 flex items-center justify-center">
						<motion.div
							initial={{ rotate: 0 }}
							animate={{ rotate: 12 }}
							className="w-24 h-24 sm:w-28 sm:h-28 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-500/20"
						>
							?
						</motion.div>
					</div>
				</div>

				<h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
					Page Not Found
				</h2>
				<p className="text-gray-500 dark:text-white/60 font-black mb-10 leading-relaxed max-w-xs mx-auto text-sm sm:text-base">
					Oops! The page you&apos;re looking for doesn&apos;t exist or has been
					moved to another galaxy.
				</p>

				<div className="flex flex-col sm:flex-row gap-4">
					<Link
						to="/"
						className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-95 text-sm tracking-wide"
					>
						<HiHome className="text-xl" />
						Back Home
					</Link>
					<button
						onClick={() => window.history.back()}
						className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white border border-gray-100 dark:border-white/5 rounded-2xl font-black hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-all hover:scale-[1.02] active:scale-95 text-sm tracking-wide shadow-sm"
					>
						<HiArrowLeft className="text-xl" />
						Go Back
					</button>
				</div>
			</motion.div>
		</div>
	);
}

export function ErrorElement() {
	const error = useRouteError();
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-white/[0.02] flex items-center justify-center p-6 transition-colors duration-300">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="max-w-2xl w-full bg-white dark:bg-white/[0.03] rounded-[2.5rem] p-8 sm:p-12 md:p-16 shadow-2xl shadow-indigo-500/5 border border-gray-100 dark:border-white/5 text-center"
			>
				<div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-50 dark:bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-500 mx-auto mb-8 sm:mb-10">
					<HiExclamationTriangle className="text-4xl sm:text-5xl" />
				</div>

				<h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
					Something went wrong!
				</h2>
				<p className="text-gray-500 dark:text-white/60 font-black mb-10 leading-relaxed max-w-md mx-auto text-sm sm:text-base">
					{error?.message ||
						"An unexpected error occurred. Our team has been notified."}
				</p>

				{!import.meta.env.PROD && (
					<div className="mb-10 p-6 sm:p-8 bg-gray-50 dark:bg-white/[0.02] rounded-[2.5rem] text-left overflow-auto max-h-48 border border-gray-100 dark:border-white/5">
						<code className="text-xs text-red-600 dark:text-red-400 font-mono break-all whitespace-pre-wrap leading-relaxed">
							{error?.stack}
						</code>
					</div>
				)}

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onClick={() => window.location.reload()}
						className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-95 text-sm tracking-wide"
					>
						Try Again
					</button>
					<button
						onClick={() => navigate("/")}
						className="px-10 py-4 bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white border border-gray-100 dark:border-white/5 rounded-2xl font-black hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-all active:scale-95 text-sm tracking-wide shadow-sm"
					>
						Go Home
					</button>
				</div>
			</motion.div>
		</div>
	);
}
