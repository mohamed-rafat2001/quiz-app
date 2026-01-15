import { useParams, Link } from "react-router-dom";
import { useQuizAnswer } from "../hooks/useQuiz";
import Loader from "../../../shared/components/ui/Loader";
import { motion } from "framer-motion";
import { HiMagnifyingGlass, HiCheckCircle, HiXCircle } from "react-icons/hi2";

export default function SingleAnswer() {
	const { id } = useParams();
	const { data: answer, isLoading } = useQuizAnswer(id);

	if (isLoading) return <Loader />;

	if (!answer)
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
				<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
					<HiMagnifyingGlass className="text-4xl" />
				</div>
				<h3 className="text-2xl font-bold text-gray-800 mb-2">
					Answer not found
				</h3>
				<p className="text-gray-500 mb-8">
					The submission you are looking for does not exist or has been removed.
				</p>
				<Link
					to="/QuizsAsnwers"
					className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-100 transition-all"
				>
					Back to My Answers
				</Link>
			</div>
		);

	return (
		<div className="py-6 sm:py-12 px-4 max-w-4xl mx-auto">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden"
			>
				{/* Header Section */}
				<div
					className={`p-6 sm:p-8 md:p-12 text-center border-b border-gray-50 ${
						answer.isPass ? "bg-green-50/30" : "bg-red-50/30"
					}`}
				>
					<motion.div
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white shadow-sm mb-4 sm:mb-6"
					>
						{answer.isPass ? (
							<HiCheckCircle className="text-green-500 text-3xl sm:text-4xl" />
						) : (
							<HiXCircle className="text-red-500 text-3xl sm:text-4xl" />
						)}
					</motion.div>
					<h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-2">
						{answer.quizId?.quizName}
					</h1>
					<p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wider">
						Quiz Results Review
					</p>
				</div>

				<div className="p-6 sm:p-8 md:p-12">
					{/* Stats Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-10 sm:mb-12">
						<div className="text-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gray-50/50 border border-gray-100">
							<p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 sm:mb-2">
								Final Score
							</p>
							<h4 className="text-2xl sm:text-3xl font-black text-indigo-600">
								{answer.score}{" "}
								<span className="text-base sm:text-lg text-gray-400 font-medium">
									/ {answer.quizId?.questions?.length || "?"}
								</span>
							</h4>
						</div>
						<div className="text-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gray-50/50 border border-gray-100">
							<p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 sm:mb-2">
								Status
							</p>
							<h4
								className={`text-2xl sm:text-3xl font-black ${
									answer.isPass ? "text-green-600" : "text-red-600"
								}`}
							>
								{answer.isPass ? "PASSED" : "FAILED"}
							</h4>
						</div>
					</div>

					{/* Questions Review */}
					<div className="space-y-4 sm:space-y-6">
						<div className="flex items-center gap-3 mb-6 sm:mb-8">
							<div className="h-6 sm:h-8 w-1 sm:w-1.5 bg-indigo-600 rounded-full"></div>
							<h2 className="text-lg sm:text-xl font-bold text-gray-900">
								Review Questions
							</h2>
						</div>

						{answer.questions?.map((q, index) => {
							const originalQ = answer.quizId?.questions?.find(
								(oq) => oq._id === q._id
							);
							const isCorrect = q.answer === originalQ?.correctAnswer;

							return (
								<motion.div
									key={index}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									className={`p-4 sm:p-6 rounded-2xl border-2 transition-all ${
										isCorrect
											? "border-green-100 bg-green-50/20"
											: "border-red-100 bg-red-50/20"
									}`}
								>
									<div className="flex items-start gap-3 sm:gap-4">
										<span
											className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm ${
												isCorrect
													? "bg-green-100 text-green-700"
													: "bg-red-100 text-red-700"
											}`}
										>
											{index + 1}
										</span>
										<div className="flex-1 min-w-0">
											<p className="font-bold text-sm sm:text-base text-gray-800 mb-4">
												{q.ques}
											</p>

											<div className="space-y-2 sm:space-y-3">
												<div
													className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl ${
														isCorrect
															? "bg-green-100/50 text-green-800"
															: "bg-red-100/50 text-red-800"
													}`}
												>
													{isCorrect ? (
														<HiCheckCircle className="text-sm sm:text-base flex-shrink-0" />
													) : (
														<HiXCircle className="text-sm sm:text-base flex-shrink-0" />
													)}
													<span className="text-[10px] sm:text-xs font-bold uppercase shrink-0">
														Your:
													</span>
													<span className="text-xs sm:text-sm font-medium truncate">
														{q.answer}
													</span>
												</div>

												{!isCorrect && originalQ?.correctAnswer && (
													<div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-green-100/50 text-green-800">
														<HiCheckCircle className="text-sm sm:text-base flex-shrink-0" />
														<span className="text-[10px] sm:text-xs font-bold uppercase shrink-0">
															Correct:
														</span>
														<span className="text-xs sm:text-sm font-medium truncate">
															{originalQ.correctAnswer}
														</span>
													</div>
												)}
											</div>
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>

					{/* Action Footer */}
					<div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100 flex justify-center">
						<Link
							to="/QuizsAsnwers"
							className="w-full sm:w-auto text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 sm:py-4 px-10 rounded-2xl transition-all text-sm sm:text-base"
						>
							Back to All Submissions
						</Link>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
