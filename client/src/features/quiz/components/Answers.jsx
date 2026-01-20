import { Link } from "react-router-dom";
import { useStudentQuizAnswers } from "../hooks/useQuiz";
import Loader from "../../../shared/components/ui/Loader";
import { motion } from "framer-motion";
import { HiEye, HiArrowPath, HiDocumentMinus } from "react-icons/hi2";

const SubmissionHeader = () => (
	<div className="mb-10 sm:mb-12">
		<h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
			Your Submissions
		</h1>
		<p className="text-gray-500 dark:text-white/60 mt-2 font-medium">
			Track your progress and review your quiz performance
		</p>
	</div>
);

const SubmissionRow = ({ answer, index }) => {
	const isResultHidden = answer.score === undefined;

	return (
		<motion.tr
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.05 }}
			className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group"
		>
			<td className="px-6 py-5 text-sm font-black text-gray-400 dark:text-white/40">
				{index + 1}
			</td>
			<td className="px-6 py-5">
				<span className="text-sm font-black text-gray-900 dark:text-white/80 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
					{answer.quizId?.quizName || "Unknown Quiz"}
				</span>
			</td>
			<td className="px-6 py-5 text-center">
				<span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black text-sm shadow-sm">
					{isResultHidden ? "?" : answer.score}
				</span>
			</td>
			<td className="px-6 py-5 text-center">
				<span
					className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
						isResultHidden
							? "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40"
							: answer.isPass
							? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400"
							: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"
					}`}
				>
					{isResultHidden ? "Pending" : answer.isPass ? "Passed" : "Failed"}
				</span>
			</td>
			<td className="px-6 py-5 text-sm font-bold text-gray-500 dark:text-white/60">
				{new Date(answer.createdAt).toLocaleDateString()}
			</td>
			<td className="px-6 py-5">
				<div className="flex items-center justify-center gap-3">
					<Link
						to={`/app/my-submissions/${answer._id}`}
						className="p-2.5 text-gray-400 dark:text-white/40 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all active:scale-95"
						title="View Details"
					>
						<HiEye className="text-xl" />
					</Link>
					{answer.quizId &&
						answer.attemptCount < (answer.quizId.tries || 1) && (
							<Link
								to={`/app/quizzes/${answer.quizId._id}`}
								className="p-2.5 text-gray-400 dark:text-white/40 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-xl transition-all active:scale-95"
								title="Retake Quiz"
							>
								<HiArrowPath className="text-xl" />
							</Link>
						)}
				</div>
			</td>
		</motion.tr>
	);
};

const EmptyState = () => (
	<div className="py-24 text-center bg-white dark:bg-white/[0.03] rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-white/5 transition-colors duration-300">
		<div className="w-24 h-24 bg-gray-50 dark:bg-white/[0.03] rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-300 dark:text-white/20 shadow-sm">
			<HiDocumentMinus className="text-5xl" />
		</div>
		<h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2 tracking-tight">
			No submissions yet
		</h3>
		<p className="text-gray-500 dark:text-white/60 font-medium">
			Start your first quiz to see your results here
		</p>
	</div>
);

export default function Answers() {
	const { data: answers, isLoading } = useStudentQuizAnswers();

	if (isLoading) return <Loader />;

	return (
		<div className="py-6 sm:py-10 max-w-6xl mx-auto px-4">
			<SubmissionHeader />

			<div className="bg-white dark:bg-white/[0.03] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-colors duration-300">
				<div className="overflow-x-auto scrollbar-hide">
					<table className="w-full text-left border-collapse min-w-[800px]">
						<thead>
							<tr className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
								<th className="px-6 py-5 text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest">
									#
								</th>
								<th className="px-6 py-5 text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest">
									Quiz Name
								</th>
								<th className="px-6 py-5 text-center text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest">
									Score
								</th>
								<th className="px-6 py-5 text-center text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest">
									Status
								</th>
								<th className="px-6 py-5 text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest">
									Date
								</th>
								<th className="px-6 py-5 text-center text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50 dark:divide-white/5">
							{answers?.map((answer, index) => (
								<SubmissionRow key={answer._id} answer={answer} index={index} />
							))}
						</tbody>
					</table>
				</div>

				{(!answers || answers.length === 0) && <EmptyState />}
			</div>
		</div>
	);
}
