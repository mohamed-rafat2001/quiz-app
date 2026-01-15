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
			<div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100">
				<div className="text-center mb-8">
					<h2 className="text-2xl font-bold text-gray-800">Start a Quiz</h2>
					<p className="text-gray-500 mt-2">
						Enter the quiz details provided by your teacher
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700 ml-1">
							Quiz ID
						</label>
						<input
							className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none ${
								errors.quizId
									? "border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
							}`}
							type="text"
							placeholder="Enter Quiz ID"
							{...register("quizId")}
						/>
						{errors.quizId && (
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-xs text-red-500 ml-1 font-medium"
							>
								{errors.quizId.message}
							</motion.p>
						)}
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700 ml-1">
							Access Password
						</label>
						<input
							className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none ${
								errors.quizPassword
									? "border-red-500 focus:ring-2 focus:ring-red-200"
									: "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
							}`}
							type="password"
							placeholder="••••••••"
							{...register("quizPassword")}
						/>
						{errors.quizPassword && (
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-xs text-red-500 ml-1 font-medium"
							>
								{errors.quizPassword.message}
							</motion.p>
						)}
					</div>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
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
