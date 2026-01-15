import { Link, useRouteError, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiHome, HiArrowLeft, HiExclamationTriangle } from "react-icons/hi2";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className="max-w-md w-full text-center"
			>
				<div className="relative mb-8">
					<motion.h1
						animate={{
							y: [0, -10, 0],
						}}
						transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
						className="text-[12rem] font-black text-indigo-100 leading-none select-none"
					>
						404
					</motion.h1>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-24 h-24 bg-indigo-600 rounded-3xl rotate-12 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-200">
							?
						</div>
					</div>
				</div>

				<h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
					Page Not Found
				</h2>
				<p className="text-gray-500 font-medium mb-10 leading-relaxed">
					Oops! The page you&apos;re looking for doesn&apos;t exist or has been
					moved to another galaxy.
				</p>

				<div className="flex flex-col sm:flex-row gap-4">
					<Link
						to="/"
						className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
					>
						<HiHome className="text-xl" />
						Back Home
					</Link>
					<button
						onClick={() => window.history.back()}
						className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95"
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
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="max-w-2xl w-full bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-gray-200 border border-gray-100 text-center"
			>
				<div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8">
					<HiExclamationTriangle className="text-4xl" />
				</div>

				<h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
					Something went wrong!
				</h2>
				<p className="text-gray-500 font-medium mb-8 leading-relaxed max-w-md mx-auto">
					{error?.message ||
						"An unexpected error occurred. Our team has been notified."}
				</p>

				{!import.meta.env.PROD && (
					<div className="mb-10 p-6 bg-gray-50 rounded-2xl text-left overflow-auto max-h-40 border border-gray-100">
						<code className="text-xs text-red-600 font-mono break-all whitespace-pre-wrap">
							{error?.stack}
						</code>
					</div>
				)}

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onClick={() => window.location.reload()}
						className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
					>
						Try Again
					</button>
					<button
						onClick={() => navigate("/")}
						className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95"
					>
						Go Home
					</button>
				</div>
			</motion.div>
		</div>
	);
}
