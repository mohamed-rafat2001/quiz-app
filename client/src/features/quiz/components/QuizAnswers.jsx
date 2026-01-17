import { useParams, Link } from "react-router-dom";
import { useTeacherQuizAnswers } from "../hooks/useQuiz";
import Loader from "../../../shared/components/ui/Loader";
import { motion } from "framer-motion";
import { HiArrowLeft, HiEye, HiUserMinus } from "react-icons/hi2";

const QuizHeader = () => (
	<motion.div
		initial={{ opacity: 0, y: -20 }}
		animate={{ opacity: 1, y: 0 }}
		className="mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2"
	>
		<div>
			<h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
				Quiz Submissions
			</h1>
			<p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
				Review student performance for this quiz
			</p>
		</div>
		<Link
			to="/app/quizzes"
			className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black hover:text-indigo-700 dark:hover:text-indigo-300 transition-all text-sm sm:text-base group active:scale-95"
		>
			<HiArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" />
			Back to Quizzes
		</Link>
	</motion.div>
);

const AnswerRow = ({ answer, index }) => (
	<motion.tr
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: index * 0.05 }}
		className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group"
	>
		<td className="px-6 py-5 text-sm font-black text-gray-400 dark:text-gray-500">
			{index + 1}
		</td>
		<td className="px-6 py-5">
			<div className="flex items-center gap-4">
				<div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-black uppercase shadow-sm transition-transform group-hover:scale-110">
					{answer.studentId?.name?.charAt(0)}
				</div>
				<span className="text-sm font-black text-gray-900 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
					{answer.studentId?.name}
				</span>
			</div>
		</td>
		<td className="px-6 py-5 text-center">
			<span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black text-sm shadow-sm">
				{answer.score}
			</span>
		</td>
		<td className="px-6 py-5 text-center">
			<span
				className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
					answer.isPass
						? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400"
						: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"
				}`}
			>
				{answer.isPass ? "Passed" : "Failed"}
			</span>
		</td>
		<td className="px-6 py-5 text-sm font-bold text-gray-500 dark:text-gray-400">
			{new Date(answer.createdAt).toLocaleDateString()}
		</td>
		<td className="px-6 py-5 text-center">
			<Link
				to={`/app/my-submissions/${answer._id}`}
				className="inline-flex p-2.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all active:scale-95"
				title="View Details"
			>
				<HiEye className="text-xl" />
			</Link>
		</td>
	</motion.tr>
);

const EmptyState = () => (
	<div className="py-24 text-center bg-white dark:bg-white/[0.03] rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-white/5 transition-colors duration-300">
		<div className="w-24 h-24 bg-gray-50 dark:bg-white/[0.03] rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-300 dark:text-gray-600 shadow-sm">
			<HiUserMinus className="text-5xl" />
		</div>
		<h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2 tracking-tight">
			No submissions yet
		</h3>
		<p className="text-gray-500 dark:text-gray-400 font-medium">
			Students haven&apos;t completed this quiz yet.
		</p>
	</div>
);

export default function QuizAnswers() {
	const { id } = useParams();
	const { data: answers, isLoading } = useTeacherQuizAnswers(id);

	if (isLoading) return <Loader />;

	return (
		<div className="py-6 sm:py-10 px-4 max-w-6xl mx-auto">
			<QuizHeader />

			<div className="bg-white dark:bg-white/[0.03] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-colors duration-300">
				<div className="overflow-x-auto scrollbar-hide">
					<table className="w-full text-left border-collapse min-w-[800px]">
						<thead>
							<tr className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
								<th className="px-6 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
									#
								</th>
								<th className="px-6 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
									Student Name
								</th>
								<th className="px-6 py-5 text-center text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
									Score
								</th>
								<th className="px-6 py-5 text-center text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
									Status
								</th>
								<th className="px-6 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
									Date
								</th>
								<th className="px-6 py-5 text-center text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50 dark:divide-white/5">
							{answers?.map((answer, index) => (
								<AnswerRow key={answer._id} answer={answer} index={index} />
							))}
						</tbody>
					</table>
				</div>

				{(!answers || answers.length === 0) && <EmptyState />}
			</div>
		</div>
	);
}
