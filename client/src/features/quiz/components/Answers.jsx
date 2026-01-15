import { Link } from "react-router-dom";
import { useStudentQuizAnswers } from "../hooks/useQuiz";
import Loader from "../../../shared/components/ui/Loader";
import { motion } from "framer-motion";
import { HiEye, HiArrowPath, HiDocumentMinus } from "react-icons/hi2";

export default function Answers() {
	const { data: answers, isLoading } = useStudentQuizAnswers();

	if (isLoading) return <Loader />;

	return (
		<div className="py-4 sm:py-8">
			<div className="mb-8 sm:mb-10">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
					Your Submissions
				</h1>
				<p className="text-sm sm:text-base text-gray-500 mt-1">
					Track your progress and review your quiz performance
				</p>
			</div>

			<div className="bg-white rounded-3xl sm:rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
				<div className="overflow-x-auto scrollbar-hide">
					<table className="w-full text-left border-collapse min-w-[700px]">
						<thead>
							<tr className="bg-gray-50/50">
								<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
									#
								</th>
								<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
									Quiz Name
								</th>
								<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 text-center">
									Score
								</th>
								<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 text-center">
									Status
								</th>
								<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
									Date
								</th>
								<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 text-center">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{answers?.map((answer, index) => (
								<motion.tr
									key={answer._id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.05 }}
									className="hover:bg-gray-50/50 transition-colors group"
								>
									<td className="px-6 py-4 text-sm font-medium text-gray-400">
										{index + 1}
									</td>
									<td className="px-6 py-4">
										<span className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
											{answer.quizId?.quizName || "Unknown Quiz"}
										</span>
									</td>
									<td className="px-6 py-4 text-center">
										<span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm">
											{answer.score}
										</span>
									</td>
									<td className="px-6 py-4 text-center">
										<span
											className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
												answer.isPass
													? "bg-green-100 text-green-700"
													: "bg-red-100 text-red-700"
											}`}
										>
											{answer.isPass ? "Passed" : "Failed"}
										</span>
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">
										{new Date(answer.createdAt).toLocaleDateString()}
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center justify-center gap-3">
											<Link
												to={`/QuizAnswers/${answer._id}`}
												className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
												title="View Details"
											>
												<HiEye className="text-xl" />
											</Link>
											<Link
												to={`/singleQuiz/${answer.quizId?._id}`}
												className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
												title="Retake Quiz"
											>
												<HiArrowPath className="text-xl" />
											</Link>
										</div>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>

				{(!answers || answers.length === 0) && (
					<div className="py-20 text-center">
						<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
							<HiDocumentMinus className="text-4xl" />
						</div>
						<h3 className="text-lg font-bold text-gray-800">
							No submissions yet
						</h3>
						<p className="text-gray-500 mt-1">
							Start your first quiz to see your results here
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
