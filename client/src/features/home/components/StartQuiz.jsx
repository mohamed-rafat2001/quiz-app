import { useForm } from "react-hook-form";
import { useStartQuiz } from "../../quiz/hooks/useQuiz";
import { zodResolver } from "@hookform/resolvers/zod";
import { startQuizSchema } from "../../../shared/validation/schemas";
import { motion } from "framer-motion";

export default function StartQuiz() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(startQuizSchema),
		mode: "onChange",
	});

	const { mutate, isPending } = useStartQuiz();

	function onSubmit(data) {
		mutate(data);
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			className="max-w-md mx-auto mt-4 sm:mt-12 px-4 sm:px-0"
		>
			<div className="bg-white dark:bg-white/[0.03] p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 transition-colors duration-300">
				<div className="text-center mb-10">
					<h2 className="text-3xl font-black text-gray-900 dark:text-white">
						Start a Quiz
					</h2>
					<p className="text-gray-500 dark:text-gray-400 mt-2 font-bold">
						Enter the quiz details provided by your teacher
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-2">
						<label className="text-sm font-black text-gray-900 dark:text-gray-200 ml-1">
							Quiz ID
						</label>
						<input
							className={`w-full px-5 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-[#151b2b] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
								errors.quizId
									? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
									: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
							}`}
							type="text"
							placeholder="Enter Quiz ID"
							{...register("quizId")}
						/>
						{errors.quizId && (
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-xs text-red-500 ml-1 font-black animate-shake"
							>
								{errors.quizId.message}
							</motion.p>
						)}
					</div>

					<div className="space-y-2">
						<label className="text-sm font-black text-gray-900 dark:text-gray-200 ml-1">
							Access Password
						</label>
						<input
							className={`w-full px-5 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-[#151b2b] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
								errors.quizPassword
									? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
									: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
							}`}
							type="password"
							placeholder="••••••••"
							{...register("quizPassword")}
						/>
						{errors.quizPassword && (
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-xs text-red-500 ml-1 font-black animate-shake"
							>
								{errors.quizPassword.message}
							</motion.p>
						)}
					</div>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.95 }}
						className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-indigo-500/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
						disabled={isPending}
					>
						{isPending ? (
							<div className="flex items-center justify-center space-x-2">
								<div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
								<span>Verifying...</span>
							</div>
						) : (
							"Start Quiz Now"
						)}
					</motion.button>
				</form>
			</div>
		</motion.div>
	);
}
