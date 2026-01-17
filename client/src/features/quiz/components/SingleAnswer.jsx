import { useParams, useNavigate } from "react-router-dom";
import { useQuizAnswer, useResultDetails } from "../hooks/useQuiz";
import { useUser } from "../../auth/hooks/useAuth";
import Loader from "../../../shared/components/ui/Loader";
import { motion } from "framer-motion";
import {
	HiMagnifyingGlass,
	HiCheckCircle,
	HiXCircle,
	HiArrowLeft,
} from "react-icons/hi2";

const ResultHeader = ({ result, isTeacher, onBack }) => (
	<div
		className={`p-8 sm:p-12 md:p-16 text-center border-b border-gray-100 dark:border-white/5 relative transition-colors duration-300 ${
			result.status
				? "bg-green-50/30 dark:bg-green-500/5"
				: "bg-red-50/30 dark:bg-red-500/5"
		}`}
	>
		<button
			onClick={onBack}
			className="absolute top-8 left-8 p-3 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-white/[0.08] rounded-2xl transition-all hidden sm:flex items-center gap-2 text-sm font-black shadow-sm active:scale-95"
		>
			<HiArrowLeft className="text-xl" />
			Back
		</button>

		<motion.div
			initial={{ scale: 0.9, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white dark:bg-white/[0.05] shadow-xl dark:shadow-none mb-6 sm:mb-8 border border-gray-50 dark:border-white/5"
		>
			{result.status ? (
				<HiCheckCircle className="text-green-500 dark:text-green-400 text-4xl sm:text-5xl" />
			) : (
				<HiXCircle className="text-red-500 dark:text-red-400 text-4xl sm:text-5xl" />
			)}
		</motion.div>
		<h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
			{result.quizName}
		</h1>
		<div className="flex flex-col items-center gap-2">
			<p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.3em]">
				Quiz Results Review
			</p>
			{isTeacher && result.studentId && (
				<div className="flex items-center gap-2 mt-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-full">
					<span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
						Student: {result.studentId.name}
					</span>
				</div>
			)}
		</div>
	</div>
);

const ResultStats = ({ result }) => (
	<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 mb-12 sm:mb-16">
		<div className="text-center p-8 sm:p-10 rounded-[2.5rem] bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-sm transition-colors">
			<p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3">
				Final Score
			</p>
			<h4 className="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">
				{result.totalScore}{" "}
				<span className="text-xl sm:text-2xl text-gray-300 dark:text-gray-600 font-black">
					/ {result.quizId?.quizScore || "?"}
				</span>
			</h4>
		</div>
		<div className="text-center p-8 sm:p-10 rounded-[2.5rem] bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-sm transition-colors">
			<p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3">
				Status
			</p>
			<h4
				className={`text-3xl sm:text-4xl font-black tracking-tight ${
					result.status
						? "text-green-600 dark:text-green-400"
						: "text-red-600 dark:text-red-400"
				}`}
			>
				{result.status ? "PASSED" : "FAILED"}
			</h4>
		</div>
	</div>
);

const QuestionReviewItem = ({ ans, index }) => {
	const question = ans.questionId;
	const isCorrect = ans.isCorrect;

	return (
		<motion.div
			initial={{ opacity: 0, x: -10 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: index * 0.1 }}
			className={`p-6 sm:p-10 rounded-[2.5rem] border-2 transition-all duration-300 ${
				isCorrect
					? "border-green-100 dark:border-green-500/10 bg-green-50/20 dark:bg-green-500/[0.02]"
					: "border-red-100 dark:border-red-500/10 bg-red-50/20 dark:bg-red-500/[0.02]"
			}`}
		>
			<div className="flex items-start gap-5 sm:gap-8">
				<span
					className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm sm:text-base shadow-sm ${
						isCorrect
							? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
							: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
					}`}
				>
					{index + 1}
				</span>
				<div className="flex-1 min-w-0">
					<p className="font-black text-lg sm:text-xl text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
						{question?.ques}
					</p>

					<div className="space-y-3 sm:space-y-4">
						<div
							className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border ${
								isCorrect
									? "bg-green-100/50 dark:bg-green-500/10 border-green-200/50 dark:border-green-500/10 text-green-900 dark:text-green-300"
									: "bg-red-100/50 dark:bg-red-500/10 border-red-200/50 dark:border-red-500/10 text-red-900 dark:text-red-300"
							}`}
						>
							{isCorrect ? (
								<HiCheckCircle className="text-xl shrink-0" />
							) : (
								<HiXCircle className="text-xl shrink-0" />
							)}
							<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1 min-w-0">
								<span className="text-[10px] font-black uppercase tracking-[0.2em] shrink-0 opacity-60">
									Your Answer:
								</span>
								<span className="text-sm sm:text-base font-bold truncate">
									{ans.studentAnswer}
								</span>
							</div>
						</div>

						{!isCorrect && question?.correctAnswer && (
							<div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border bg-green-100/50 dark:bg-green-500/10 border-green-200/50 dark:border-green-500/10 text-green-900 dark:text-green-300">
								<HiCheckCircle className="text-xl shrink-0" />
								<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1 min-w-0">
									<span className="text-[10px] font-black uppercase tracking-[0.2em] shrink-0 opacity-60">
										Correct Answer:
									</span>
									<span className="text-sm sm:text-base font-bold truncate">
										{question.correctAnswer}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default function SingleAnswer() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data: user } = useUser();
	const { data: result, isLoading: isLoadingResult } = useQuizAnswer(id);
	const { data: details, isLoading: isLoadingDetails } = useResultDetails(id);

	const isLoading = isLoadingResult || isLoadingDetails;
	const isTeacher = user?.role === "teacher";

	if (isLoading) return <Loader />;

	if (!result)
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 transition-colors duration-300">
				<div className="w-20 h-20 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-full flex items-center justify-center mb-6 text-gray-300 dark:text-gray-600">
					<HiMagnifyingGlass className="text-4xl" />
				</div>
				<h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
					Answer not found
				</h3>
				<p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
					The submission you are looking for does not exist or has been removed.
				</p>
				<button
					onClick={() => navigate(-1)}
					className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all text-sm tracking-wide"
				>
					Go Back
				</button>
			</div>
		);

	return (
		<div className="py-6 sm:py-12 px-4 max-w-4xl mx-auto">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white dark:bg-white/[0.03] rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden transition-colors duration-300"
			>
				<ResultHeader
					result={result}
					isTeacher={isTeacher}
					onBack={() => navigate(-1)}
				/>

				<div className="p-6 sm:p-8 md:p-12">
					<ResultStats result={result} />

					<div className="space-y-4 sm:space-y-6">
						<div className="flex items-center gap-3 mb-6 sm:mb-8">
							<div className="h-6 sm:h-8 w-1.5 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]"></div>
							<h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
								Review Questions
							</h2>
						</div>

						{details?.map((ans, index) => (
							<QuestionReviewItem key={ans._id} ans={ans} index={index} />
						))}
					</div>

					<div className="mt-10 sm:mt-16 pt-8 sm:pt-10 border-t border-gray-100 dark:border-white/5 flex justify-center">
						<button
							onClick={() => navigate(-1)}
							className="w-full sm:w-auto text-center bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-900 dark:text-white font-black py-4 px-12 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 border border-gray-100 dark:border-white/5 text-sm sm:text-base tracking-wide shadow-sm"
						>
							Back to List
						</button>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
