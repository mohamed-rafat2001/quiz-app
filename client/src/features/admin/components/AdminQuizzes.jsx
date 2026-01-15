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
				<h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
				<p className="text-gray-500 mt-2">
					Monitor and manage all quizzes on the platform.
				</p>
			</div>

			<div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-gray-50 border-b border-gray-100">
								<th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
									Quiz Info
								</th>
								<th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
									Teacher
								</th>
								<th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
									Statistics
								</th>
								<th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{quizzes?.map((quiz) => (
								<motion.tr
									key={quiz._id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="hover:bg-gray-50 transition-colors"
								>
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-bold">
												<HiAcademicCap className="text-xl" />
											</div>
											<div>
												<p className="font-bold text-gray-900">
													{quiz.quizName}
												</p>
												<p className="text-sm text-gray-500 truncate max-w-[200px]">
													{quiz.description}
												</p>
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex flex-col">
											<span className="font-medium text-gray-900">
												{quiz.teacherId?.name || "Unknown"}
											</span>
											<span className="text-xs text-gray-500">
												{quiz.teacherId?.email}
											</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex flex-col gap-1">
											<span className="text-xs font-bold text-indigo-600">
												{quiz.questions?.length || 0} Questions
											</span>
											<span className="text-xs font-bold text-green-600">
												{Math.round(quiz.successRate || 0)}% Success Rate
											</span>
										</div>
									</td>
									<td className="px-6 py-4 text-right">
										<div className="flex items-center justify-end gap-2">
											<Link
												to={`/singleQuiz/${quiz._id}`}
												className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
												title="Preview Quiz"
											>
												<HiEye />
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
												className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
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
