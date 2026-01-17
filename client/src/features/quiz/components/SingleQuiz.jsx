import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitQuizSchema } from "../../../shared/validation/schemas";
import { useParams, useNavigate } from "react-router-dom";
import { useQuiz, useAddAnswer } from "../hooks/useQuiz";
import { useUser } from "../../auth/hooks/useAuth";
import Loader from "../../../shared/components/ui/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { HiClock, HiCheckCircle, HiExclamationTriangle } from "react-icons/hi2";
import toast from "react-hot-toast";
import React, { useState, useEffect, useCallback } from "react";

// Sub-components for better organization
const QuizProgressBar = ({ progress }) => (
	<div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 dark:bg-white/5 z-50">
		<motion.div
			initial={{ width: 0 }}
			animate={{ width: `${progress}%` }}
			className="h-full bg-indigo-600 dark:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
		/>
	</div>
);

const QuizTimer = ({ timeLeft, formatTime, answeredCount, totalQuestions }) => (
	<motion.div
		initial={{ y: -50, opacity: 0 }}
		animate={{ y: 0, opacity: 1 }}
		className="sticky top-4 z-30 mb-8"
	>
		<div className="bg-white/80 dark:bg-[#0b0f1a]/80 backdrop-blur-xl border border-gray-100 dark:border-white/5 shadow-2xl rounded-[2rem] px-8 py-5 flex items-center justify-between max-w-sm mx-auto transition-colors duration-300">
			<div className="flex items-center gap-4">
				<div
					className={`p-3 rounded-2xl transition-colors ${
						timeLeft < 60
							? "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400"
							: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
					}`}
				>
					<HiClock className="text-2xl" />
				</div>
				<div>
					<p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
						Time Remaining
					</p>
					<p
						className={`text-xl font-black font-mono tracking-tighter ${
							timeLeft < 60
								? "text-red-600 dark:text-red-500 animate-pulse"
								: "text-gray-900 dark:text-white"
						}`}
					>
						{timeLeft !== null ? formatTime(timeLeft) : "--:--"}
					</p>
				</div>
			</div>
			<div className="h-10 w-px bg-gray-100 dark:bg-white/5"></div>
			<div className="text-right">
				<p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
					Progress
				</p>
				<p className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
					{answeredCount}/{totalQuestions}
				</p>
			</div>
		</div>
	</motion.div>
);

const ConfirmationModal = ({
	show,
	onClose,
	onConfirm,
	isPending,
	answeredCount,
	totalQuestions,
}) => (
	<AnimatePresence>
		{show && (
			<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/80 backdrop-blur-md">
				<motion.div
					initial={{ scale: 0.9, opacity: 0, y: 20 }}
					animate={{ scale: 1, opacity: 1, y: 0 }}
					exit={{ scale: 0.9, opacity: 0, y: 20 }}
					className="bg-white dark:bg-[#0b0f1a] rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-gray-100 dark:border-white/5"
				>
					<div className="text-center">
						<div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-8 shadow-sm">
							<HiCheckCircle className="text-4xl" />
						</div>
						<h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
							Ready to submit?
						</h3>
						<p className="text-gray-500 dark:text-gray-400 mb-10 font-medium leading-relaxed">
							{answeredCount < totalQuestions
								? `You've only answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to finish?`
								: "Great job! You've answered all questions. Ready to see your results?"}
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<button
								onClick={onClose}
								className="flex-1 px-8 py-4 rounded-2xl border-2 border-gray-100 dark:border-white/5 font-black text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all hover:scale-[1.02] active:scale-95"
							>
								Keep Working
							</button>
							<button
								onClick={onConfirm}
								disabled={isPending}
								className="flex-1 px-8 py-4 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white font-black hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-xl shadow-indigo-100 dark:shadow-indigo-500/10 transition-all disabled:opacity-70 hover:scale-[1.02] active:scale-95"
							>
								{isPending ? "Submitting..." : "Yes, Submit"}
							</button>
						</div>
					</div>
				</motion.div>
			</div>
		)}
	</AnimatePresence>
);

const QuestionItem = ({ el, index, register, error }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: index * 0.1 }}
		className="bg-white dark:bg-[#0b0f1a] p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group duration-500"
	>
		<div className="flex items-start gap-6 mb-10">
			<span className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shadow-sm">
				{index + 1}
			</span>
			<h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white pt-1 leading-tight tracking-tight">
				{el.ques}
			</h3>
		</div>

		<div className="grid grid-cols-1 gap-4">
			{el.answers.map((answer, i) => (
				<div key={i} className="relative group/option">
					<input
						type="radio"
						id={answer + index}
						className="peer hidden"
						{...register(`answer[${index}]`)}
						value={JSON.stringify({
							answer: answer,
							_id: el._id,
							ques: el.ques,
						})}
					/>
					<label
						htmlFor={answer + index}
						className="flex items-center px-8 py-5 rounded-3xl border-2 border-gray-50 dark:border-white/5 cursor-pointer transition-all peer-checked:border-indigo-600 dark:peer-checked:border-indigo-500 peer-checked:bg-indigo-50/50 dark:peer-checked:bg-indigo-500/10 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] text-gray-600 dark:text-gray-400 peer-checked:text-indigo-700 dark:peer-checked:text-indigo-300 font-black group-hover/option:border-indigo-100 dark:group-hover/option:border-white/10"
					>
						<div className="w-6 h-6 rounded-full border-2 border-gray-200 dark:border-white/10 mr-5 flex items-center justify-center peer-checked:border-indigo-600 dark:peer-checked:border-indigo-500 bg-white dark:bg-transparent transition-all shrink-0">
							<div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500 scale-0 transition-transform peer-checked:scale-100" />
						</div>
						<span className="flex-1 text-base sm:text-lg">{answer}</span>
					</label>
				</div>
			))}
		</div>

		<AnimatePresence>
			{error && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					className="mt-6 flex items-center gap-2 text-red-500 dark:text-red-400 text-sm font-black ml-2"
				>
					<HiExclamationTriangle className="text-lg" />
					<span>{error.message}</span>
				</motion.div>
			)}
		</AnimatePresence>
	</motion.div>
);

export default function SingleQuiz() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [timeLeft, setTimeLeft] = useState(null);
	const [isTimeUp, setIsTimeUp] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		control,
	} = useForm({
		resolver: zodResolver(submitQuizSchema),
		mode: "onChange",
	});

	const { data: quiz, isLoading } = useQuiz(id);
	const { user } = useUser();
	const { mutate, isPending } = useAddAnswer();
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [formData, setFormData] = useState(null);

	// Check if student has remaining tries
	const attemptsLeft =
		quiz && user && user.role === "student"
			? (quiz.tries || 1) - (quiz.attemptCount || 0)
			: 1;

	useEffect(() => {
		if (quiz && user?.role === "student" && attemptsLeft <= 0) {
			toast.error("You have exhausted all attempts for this quiz.");
			navigate("/app/quizzes", { replace: true });
		}
	}, [quiz, user, attemptsLeft, navigate]);

	// Watch all answers to calculate progress
	const watchedAnswers = useWatch({
		control,
		name: "answer",
	});

	const answeredCount = watchedAnswers?.filter((a) => a).length || 0;
	const totalQuestions = quiz?.questions?.length || 0;
	const progress =
		totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

	useEffect(() => {
		if (quiz?.expire) {
			// Calculate total seconds based on unit
			const multiplier = quiz.expireUnit === "hours" ? 3600 : 60;
			const totalSeconds = Math.floor(quiz.expire * multiplier);
			setTimeLeft(totalSeconds);
		}
	}, [quiz]);

	const formatTime = (seconds) => {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s
			.toString()
			.padStart(2, "0")}`;
	};

	const performSubmit = useCallback(
		(questions, isAuto = false) => {
			mutate(
				{ id, questions },
				{
					onSuccess: () => {
						toast.success(
							isAuto
								? "Answers submitted automatically!"
								: "Quiz submitted successfully!"
						);
						navigate("/app/my-submissions", { replace: true });
					},
					onError: (err) => {
						toast.error(err.message || "Failed to submit answers");
					},
				}
			);
		},
		[id, mutate, navigate]
	);

	const onSubmit = useCallback((data) => {
		const questions = data.answer.map((q) => JSON.parse(q));
		setFormData(questions);
		setShowConfirmModal(true);
	}, []);

	const handleAutoSubmit = useCallback(() => {
		if (isTimeUp) return; // Prevent multiple auto-submissions
		setIsTimeUp(true);

		const data = getValues();
		// If some questions are not answered, we send what we have
		const answers = data.answer || [];
		const formattedAnswers = quiz.questions.map((q, index) => {
			const selected = answers[index];
			if (selected) {
				try {
					return typeof selected === "string" ? JSON.parse(selected) : selected;
				} catch (e) {
					return { answer: selected, _id: q._id, ques: q.ques };
				}
			}
			return { answer: "", _id: q._id, ques: q.ques };
		});

		toast.error("Time is up! Submitting your answers automatically...", {
			duration: 5000,
			icon: "⏰",
		});

		performSubmit(formattedAnswers, true);
	}, [getValues, quiz?.questions, performSubmit, isTimeUp]);

	useEffect(() => {
		if (timeLeft === null || isTimeUp) return;
		if (timeLeft <= 0) {
			handleAutoSubmit();
			return;
		}

		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft, handleAutoSubmit, isTimeUp]);

	if (isLoading) return <Loader />;

	if (!quiz) {
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
				<div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-[2rem] flex items-center justify-center mb-8 text-red-500 dark:text-red-400 shadow-sm">
					<HiExclamationTriangle className="text-5xl" />
				</div>
				<h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
					Quiz not found
				</h3>
				<p className="text-gray-500 dark:text-gray-400 mb-10 font-medium">
					The quiz you are looking for does not exist or has been removed.
				</p>
				<button
					onClick={() => navigate("/app/quizzes")}
					className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-indigo-500/10 transition-all hover:scale-[1.02] active:scale-95"
				>
					Back to Quizzes
				</button>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto py-8 sm:py-16 px-4 relative">
			<QuizProgressBar progress={progress} />

			<QuizTimer
				timeLeft={timeLeft}
				formatTime={formatTime}
				answeredCount={answeredCount}
				totalQuestions={totalQuestions}
			/>

			<ConfirmationModal
				show={showConfirmModal}
				onClose={() => setShowConfirmModal(false)}
				onConfirm={() => performSubmit(formData)}
				isPending={isPending}
				answeredCount={answeredCount}
				totalQuestions={totalQuestions}
			/>

			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center mb-16"
			>
				<h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
					{quiz.quizName}
				</h1>
				<div className="flex items-center justify-center gap-3 text-gray-500 dark:text-gray-400 font-black text-sm uppercase tracking-widest">
					<HiCheckCircle className="text-indigo-600 dark:text-indigo-400 text-xl" />
					<span>Select the best answer for each question</span>
				</div>
			</motion.div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-8 sm:space-y-12"
			>
				{quiz.questions.map((el, index) => (
					<QuestionItem
						key={el._id}
						el={el}
						index={index}
						register={register}
						error={errors?.answer?.[index]}
					/>
				))}

				<motion.div
					className="flex flex-col items-center gap-8 pt-12"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
				>
					<div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.3em]">
						<div className="w-12 h-px bg-gray-200 dark:bg-white/10"></div>
						<span>End of Quiz</span>
						<div className="w-12 h-px bg-gray-200 dark:bg-white/10"></div>
					</div>

					<button
						className="w-full sm:w-auto min-w-[320px] bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-black py-5 px-14 rounded-[2.5rem] shadow-2xl shadow-indigo-200 dark:shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg"
						disabled={isPending || isTimeUp}
					>
						{isPending ? (
							<div className="flex items-center justify-center gap-3">
								<div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
								<span>Submitting Quiz...</span>
							</div>
						) : (
							"Complete & Submit Quiz"
						)}
					</button>
				</motion.div>
			</form>
		</div>
	);
}
