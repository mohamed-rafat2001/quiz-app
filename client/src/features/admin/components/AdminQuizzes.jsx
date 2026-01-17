import { motion } from "framer-motion";
import { useAdminQuizzes, useDeleteQuizAdmin } from "../hooks/useAdmin";
import { HiTrash, HiEye, HiAcademicCap } from "react-icons/hi2";
import { Link } from "react-router-dom";

export default function AdminQuizzes() {
	const { data: quizzes, isLoading } = useAdminQuizzes();
	const { mutate: deleteQuiz } = useDeleteQuizAdmin();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-black text-gray-900 dark:text-white">
					Quiz Management
				</h1>
				<p className="text-gray-500 dark:text-gray-400 mt-2 font-bold">
					Monitor and manage all quizzes on the platform.
				</p>
			</div>

			<div className="bg-white dark:bg-white/[0.03] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden transition-colors duration-300">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
								<th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
									Quiz Info
								</th>
								<th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
									Teacher
								</th>
								<th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
									Statistics
								</th>
								<th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-white/5">
							{quizzes?.map((quiz) => (
								<motion.tr
									key={quiz._id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
								>
									<td className="px-8 py-5">
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 font-black shadow-sm">
												<HiAcademicCap className="text-2xl" />
											</div>
											<div>
												<p className="font-black text-gray-900 dark:text-white text-base">
													{quiz.quizName}
												</p>
												<p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[250px] font-black">
													{quiz.description}
												</p>
											</div>
										</div>
									</td>
									<td className="px-8 py-5">
										<div className="flex flex-col">
											<span className="font-black text-gray-900 dark:text-white">
												{quiz.teacherId?.name || "Unknown"}
											</span>
											<span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
												{quiz.teacherId?.email}
											</span>
										</div>
									</td>
									<td className="px-8 py-5">
										<div className="flex flex-col gap-1.5">
											<span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-lg w-fit">
												{quiz.questions?.length || 0} Questions
											</span>
											<span className="text-xs font-black text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-lg w-fit">
												{Math.round(quiz.successRate || 0)}% Success Rate
											</span>
										</div>
									</td>
									<td className="px-8 py-5 text-right">
										<div className="flex items-center justify-end gap-3">
											<Link
												to={`/app/quizzes/${quiz._id}`}
												className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all shadow-sm active:scale-90"
												title="Preview Quiz"
											>
												<HiEye className="text-lg" />
											</Link>
											<button
												onClick={() => {
													if (
														window.confirm(
															"Are you sure you want to delete this quiz?"
														)
													) {
														deleteQuiz(quiz._id);
													}
												}}
												className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all active:scale-90"
												title="Delete Quiz"
											>
												<HiTrash />
											</button>
										</div>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
