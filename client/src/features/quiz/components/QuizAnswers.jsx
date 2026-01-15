import { useParams, Link } from "react-router-dom";
import { useTeacherQuizAnswers } from "../hooks/useQuiz";
import Loader from "../../../shared/components/ui/Loader";
import { motion } from "framer-motion";
import { HiArrowLeft, HiEye, HiUserMinus } from "react-icons/hi2";

export default function QuizAnswers() {
	const { id } = useParams();
	const { data: answers, isLoading } = useTeacherQuizAnswers(id);

	if (isLoading) return <Loader />;

	return (
		<div className="py-4 sm:py-8 px-4 max-w-6xl mx-auto">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
			>
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
						Quiz Submissions
					</h1>
					<p className="text-sm sm:text-base text-gray-500 mt-1">
						Review student performance for this quiz
					</p>
				</div>
				<Link
					to="/Quizs"
					className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors text-sm sm:text-base"
				>
					<HiArrowLeft className="text-lg" />
					Back to Quizzes
				</Link>
			</motion.div>

			<div className="bg-white rounded-3xl sm:rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
				<div className="overflow-x-auto scrollbar-hide">
					<table className="w-full text-left border-collapse min-w-[700px]">
						<thead>
							<tr className="bg-gray-50/50">
								<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
									#
								</th>
								<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
									Student Name
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
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold uppercase">
												{answer.studentId?.name?.charAt(0)}
											</div>
											<span className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
												{answer.studentId?.name}
											</span>
										</div>
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
									<td className="px-6 py-4 text-center">
										<Link
											to={`/QuizAnswers/${answer._id}`}
											className="inline-flex p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
											title="View Details"
										>
											<HiEye className="text-xl" />
										</Link>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>

				{(!answers || answers.length === 0) && (
					<div className="py-20 text-center">
						<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
							<HiUserMinus className="text-4xl" />
						</div>
						<h3 className="text-lg font-bold text-gray-800">
							No submissions yet
						</h3>
						<p className="text-gray-500 mt-1">
							Students haven&apos;t completed this quiz yet.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
