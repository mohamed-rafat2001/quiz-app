import StartQuiz from "../features/home/components/StartQuiz";
import { useStudentQuizAnswers } from "../features/quiz/hooks/useQuiz";
import { Link } from "react-router-dom";
import { HiCheckCircle, HiXCircle, HiArrowRight } from "react-icons/hi2";
import { motion } from "framer-motion";

export default function Home() {
	const { data: submissions, isLoading } = useStudentQuizAnswers({
		limit: 3,
		sort: "-createdAt",
	});

	return (
		<div className="py-6 sm:py-12 px-4">
			<div className="max-w-4xl mx-auto text-center mb-10 sm:mb-16">
				<h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
					Ready to test your{" "}
					<span className="text-indigo-600 dark:text-indigo-400">skills?</span>
				</h1>
				<p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4 font-bold">
					Enter your quiz credentials below to begin. Make sure you have your
					Quiz ID and Password ready.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
				<div className="lg:col-span-7">
					<StartQuiz />
				</div>

				<div className="lg:col-span-5 space-y-8">
					<div className="flex items-center justify-between mb-2">
						<h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
							Recent Results
						</h2>
						{submissions?.length > 0 && (
							<Link
								to="/app/my-submissions"
								className="text-sm font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
							>
								View All <HiArrowRight />
							</Link>
						)}
					</div>

					{isLoading ? (
						<div className="space-y-4">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-24 bg-gray-100 dark:bg-white/5 rounded-3xl animate-pulse"
								/>
							))}
						</div>
					) : submissions?.length > 0 ? (
						<div className="space-y-4">
							{submissions.slice(0, 3).map((submission, index) => (
								<motion.div
									key={submission._id}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									className="bg-white dark:bg-white/[0.03] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group"
								>
									<div className="flex items-center justify-between">
										<div className="space-y-1">
											<h3 className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-[180px]">
												{submission.quizId?.quizName || "Quiz"}
											</h3>
											<p className="text-xs text-gray-400 dark:text-white/40 font-bold">
												{new Date(submission.createdAt).toLocaleDateString()}
											</p>
										</div>
										<div className="text-right">
											<div className="flex items-center gap-2 mb-1">
												{submission.isPass ? (
													<HiCheckCircle className="text-green-500 text-lg" />
												) : (
													<HiXCircle className="text-red-500 text-lg" />
												)}
												<span className="font-black text-xl text-gray-900 dark:text-white">
													{submission.score}
												</span>
											</div>
											<span
												className={`text-[10px] font-black uppercase tracking-widest ${
													submission.isPass
														? "text-green-600 dark:text-green-400"
														: "text-red-600 dark:text-red-400"
												}`}
											>
												{submission.isPass ? "Passed" : "Failed"}
											</span>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					) : (
						<div className="bg-gray-50 dark:bg-white/[0.02] rounded-[2rem] p-8 text-center border-2 border-dashed border-gray-100 dark:border-white/5">
							<p className="text-gray-400 dark:text-white/30 font-bold text-sm">
								No results yet. Complete your first quiz to see your scores
								here!
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
