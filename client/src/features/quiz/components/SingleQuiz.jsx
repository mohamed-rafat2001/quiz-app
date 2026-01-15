import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitQuizSchema } from "../../../shared/validation/schemas";
import { useParams, useNavigate } from "react-router-dom";
import { useQuiz, useAddAnswer } from "../hooks/useQuiz";
import Loader from "../../../shared/components/ui/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { HiClock, HiCheckCircle, HiExclamationTriangle } from "react-icons/hi2";
import toast from "react-hot-toast";
import React, { useState, useEffect, useCallback } from "react";

// Sub-components for better organization
const QuizProgressBar = ({ progress }) => (
	<div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-50">
		<motion.div
			initial={{ width: 0 }}
			animate={{ width: `${progress}%` }}
			className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
		/>
	</div>
);

const QuizTimer = ({ timeLeft, formatTime, answeredCount, totalQuestions }) => (
	<motion.div
		initial={{ y: -50, opacity: 0 }}
		animate={{ y: 0, opacity: 1 }}
		className="sticky top-4 z-30 mb-8"
	>
		<div className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl px-6 py-4 flex items-center justify-between max-w-sm mx-auto">
			<div className="flex items-center gap-3">
				<div
					className={`p-2 rounded-lg ${
						timeLeft < 60
							? "bg-red-50 text-red-500"
							: "bg-indigo-50 text-indigo-600"
					}`}
				>
					<HiClock className="text-xl" />
				</div>
				<div>
					<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
						Time Remaining
					</p>
					<p
						className={`text-lg font-black font-mono ${
							timeLeft < 60 ? "text-red-600 animate-pulse" : "text-gray-900"
						}`}
					>
						{timeLeft !== null ? formatTime(timeLeft) : "--:--"}
					</p>
				</div>
			</div>
			<div className="h-10 w-px bg-gray-100"></div>
			<div className="text-right">
				<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
					Progress
				</p>
				<p className="text-lg font-black text-gray-900">
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
			<div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					className="bg-white rounded-4xl p-8 max-w-md w-full shadow-2xl"
				>
					<div className="text-center">
						<div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
							<HiCheckCircle className="text-3xl" />
						</div>
						<h3 className="text-2xl font-bold text-gray-900 mb-2">
							Ready to submit?
						</h3>
						<p className="text-gray-500 mb-8">
							{answeredCount < totalQuestions
								? `You've only answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to finish?`
								: "Great job! You've answered all questions. Ready to see your results?"}
						</p>
						<div className="flex gap-4">
							<button
								onClick={onClose}
								className="flex-1 px-6 py-3 rounded-lg border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-all"
							>
								Keep Working
							</button>
							<button
								onClick={onConfirm}
								disabled={isPending}
								className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-70"
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
		className="bg-white p-6 sm:p-10 rounded-4xl sm:rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-md transition-all group"
	>
		<div className="flex items-start gap-4 mb-8">
			<span className="shrink-0 w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
				{index + 1}
			</span>
			<h3 className="text-lg sm:text-xl font-bold text-gray-800 pt-1 leading-relaxed">
				{el.ques}
			</h3>
		</div>

		<div className="grid grid-cols-1 gap-3">
			{el.answers.map((answer, i) => (
				<div key={i} className="relative">
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
						className="flex items-center px-6 py-4 rounded-2xl border-2 border-gray-50 cursor-pointer transition-all peer-checked:border-indigo-600 peer-checked:bg-indigo-50/50 hover:bg-gray-50/50 text-gray-600 peer-checked:text-indigo-700 font-bold group/label"
					>
						<div className="w-6 h-6 rounded-full border-2 border-gray-200 mr-4 flex items-center justify-center peer-checked:border-indigo-600 bg-white transition-all shrink-0">
							<div className="w-2.5 h-2.5 rounded-full bg-indigo-600 scale-0 transition-transform peer-checked:scale-100" />
						</div>
						<span className="flex-1">{answer}</span>
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
					className="mt-4 flex items-center gap-2 text-red-500 text-sm font-bold ml-1"
				>
					<HiExclamationTriangle />
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
	const { mutate, isPending } = useAddAnswer();
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [formData, setFormData] = useState(null);

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
			// expire is in hours, convert to seconds
			const totalSeconds = Math.floor(quiz.expire * 3600);
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

	const Submit = useCallback(
		(data, isAuto = false) => {
			const questions = isAuto
				? data.answer
				: data.answer.map((q) => JSON.parse(q));

			if (isAuto) {
				toast.error("Time is up! Submitting your answers automatically...");
				performSubmit(questions, true);
			} else {
				setFormData(questions);
				setShowConfirmModal(true);
			}
		},
		[performSubmit]
	);

	const handleAutoSubmit = useCallback(() => {
		const data = getValues();
		// If some questions are not answered, we send what we have
		const answers = data.answer || [];
		const formattedAnswers = quiz.questions.map((q, index) => {
			const selected = answers[index];
			if (selected) {
				return JSON.parse(selected);
			}
			return { answer: "", _id: q._id, ques: q.ques };
		});

		Submit({ answer: formattedAnswers }, true);
	}, [getValues, quiz?.questions, Submit]);

	useEffect(() => {
		if (timeLeft === null) return;
		if (timeLeft <= 0) {
			setIsTimeUp(true);
			handleAutoSubmit();
			return;
		}

		const timer = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft, handleAutoSubmit]);

	if (isLoading) return <Loader />;

	if (!quiz) {
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
				<div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
					<HiExclamationTriangle className="text-4xl" />
				</div>
				<h3 className="text-2xl font-bold text-gray-800 mb-2">
					Quiz not found
				</h3>
				<p className="text-gray-500 mb-8">
					The quiz you are looking for does not exist or has been removed.
				</p>
				<button
					onClick={() => navigate("/app/quizzes")}
					className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all"
				>
					Back to Quizzes
				</button>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 relative">
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
				className="text-center mb-12"
			>
				<h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
					{quiz.quizName}
				</h1>
				<div className="flex items-center justify-center gap-2 text-gray-500 font-medium">
					<HiCheckCircle className="text-indigo-500" />
					<span>Please select the best answer for each question</span>
				</div>
			</motion.div>

			<form
				onSubmit={handleSubmit((data) => Submit(data))}
				className="space-y-6 sm:space-y-10"
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
					className="flex flex-col items-center gap-6 pt-10"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
				>
					<div className="flex items-center gap-2 text-sm text-gray-400 font-bold uppercase tracking-widest">
						<div className="w-8 h-px bg-gray-200"></div>
						<span>End of Quiz</span>
						<div className="w-8 h-px bg-gray-200"></div>
					</div>

					<button
						className="w-full sm:w-auto min-w-[300px] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-12 rounded-4xl shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
						disabled={isPending || isTimeUp}
					>
						{isPending ? (
							<div className="flex items-center justify-center gap-3">
								<div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
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
