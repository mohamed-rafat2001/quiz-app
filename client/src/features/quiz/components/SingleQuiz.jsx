import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitQuizSchema } from "../../../shared/validation/schemas";
import { useParams, useNavigate } from "react-router-dom";
import { useQuiz, useAddAnswer } from "../hooks/useQuiz";
import { useUser } from "../../auth/hooks/useAuth";
import Loader from "../../../shared/components/ui/Loader";
import { motion, AnimatePresence } from "framer-motion";
import {
	HiClock,
	HiCheckCircle,
	HiExclamationTriangle,
	HiPhoto,
	HiXMark,
} from "react-icons/hi2";
import toast from "react-hot-toast";
import React, { useState, useEffect, useCallback } from "react";
import { uploadImage, deleteImage } from "../../../shared/services/uploadApi";

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
		<div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-100 dark:border-white/5 shadow-2xl rounded-[2rem] px-8 py-5 flex items-center justify-between max-w-sm mx-auto transition-colors duration-300">
			<div className="flex items-center gap-4">
				<div
					className={`p-3 rounded-2xl transition-colors ${
						timeLeft < 60
							? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
							: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
					}`}
				>
					<HiClock className="text-2xl" />
				</div>
				<div>
					<p className="text-[10px] font-black text-gray-400 dark:text-white/40 uppercase tracking-[0.2em]">
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
				<p className="text-[10px] font-black text-gray-400 dark:text-white/40 uppercase tracking-[0.2em]">
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
			<div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/80 backdrop-blur-md">
				<motion.div
					initial={{ scale: 0.9, opacity: 0, y: 20 }}
					animate={{ scale: 1, opacity: 1, y: 0 }}
					exit={{ scale: 0.9, opacity: 0, y: 20 }}
					className="bg-white dark:bg-white/[0.03] rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-gray-100 dark:border-white/5"
				>
					<div className="text-center">
						<div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-8 shadow-sm">
							<HiCheckCircle className="text-4xl" />
						</div>
						<h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
							Ready to submit?
						</h3>
						<p className="text-gray-600 dark:text-white/60 mb-10 font-black leading-relaxed">
							{answeredCount < totalQuestions
								? `You've only answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to finish?`
								: "Great job! You've answered all questions. Ready to see your results?"}
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<button
								onClick={onClose}
								className="flex-1 px-8 py-4 rounded-2xl border-2 border-gray-100 dark:border-white/5 font-black text-gray-600 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-white/5 transition-all hover:scale-[1.02] active:scale-95"
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

const AnswerImageUpload = ({ index, control, setValue }) => {
	const image = useWatch({
		control,
		name: `answerImages[${index}]`,
	});
	const [isUploading, setIsUploading] = React.useState(false);

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		try {
			setIsUploading(true);
			const data = await uploadImage(file);
			setValue(`answerImages[${index}]`, data);
			toast.success("Image uploaded!");
		} catch (err) {
			toast.error(err.message);
		} finally {
			setIsUploading(false);
		}
	};

	const handleRemoveImage = async () => {
		if (!image?.public_id) return;
		try {
			await deleteImage(image.public_id);
			setValue(`answerImages[${index}]`, undefined);
			toast.success("Image removed");
		} catch (err) {
			toast.error(err.message);
		}
	};

	return (
		<div className="mt-6">
			{image ? (
				<div className="relative inline-block group/img">
					<img
						src={image.secure_url}
						alt={`Attached proof for question ${index + 1}`}
						className="max-h-48 w-auto object-contain rounded-2xl border border-gray-100 dark:border-white/10"
						referrerPolicy="no-referrer"
						loading="lazy"
						onError={(e) => {
							e.target.onerror = null;
							e.target.style.display = 'none';
						}}
					/>
					<button
						type="button"
						onClick={handleRemoveImage}
						className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
					>
						<HiXMark className="text-sm" />
					</button>
				</div>
			) : (
				<label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-all group">
					{isUploading ? (
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
					) : (
						<HiPhoto className="text-lg text-gray-400 dark:text-white/20 group-hover:text-indigo-500" />
					)}
					<span className="text-xs font-black text-gray-500 dark:text-white/40">
						{isUploading ? "Uploading..." : "Attach proof/work (optional)"}
					</span>
					<input
						type="file"
						className="hidden"
						accept="image/*"
						onChange={handleFileChange}
						disabled={isUploading}
					/>
				</label>
			)}
		</div>
	);
};

const QuestionItem = ({ el, index, register, error, control, setValue }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: index * 0.1 }}
		className="bg-white dark:bg-white/[0.03] p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group duration-500"
	>
		<div className="flex items-start gap-6 mb-10">
			<span className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shadow-sm">
				{index + 1}
			</span>
			<div className="flex-1 space-y-4">
				<h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white pt-1 leading-tight tracking-tight">
					{el.ques}
				</h3>
				{el.image && (
					<div className="mt-4">
						<img
							src={el.image.secure_url}
							alt="Question"
							className="max-h-80 w-auto object-contain rounded-2xl border border-gray-100 dark:border-white/10"
							referrerPolicy="no-referrer"
							loading="lazy"
							onError={(e) => {
								e.target.onerror = null;
								e.target.style.display = 'none';
							}}
						/>
					</div>
				)}
			</div>
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
						className="flex items-center px-8 py-5 rounded-3xl border-2 border-gray-50 dark:border-white/5 cursor-pointer transition-all peer-checked:border-blue-600 dark:peer-checked:border-blue-500 peer-checked:bg-blue-50/50 dark:peer-checked:bg-blue-500/10 hover:bg-gray-50/50 dark:hover:bg-white/[0.05] text-gray-600 dark:text-white/40 peer-checked:text-blue-700 dark:peer-checked:text-blue-300 font-black group-hover/option:border-blue-100 dark:group-hover/option:border-white/10 peer-checked:[&>div]:border-blue-600 dark:peer-checked:[&>div]:border-blue-500 peer-checked:[&>div>div]:scale-100"
					>
						<div className="w-6 h-6 rounded-full border-2 border-gray-200 dark:border-white/10 mr-5 flex items-center justify-center bg-white dark:bg-white/[0.05] transition-all shrink-0">
							<div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500 scale-0 transition-transform" />
						</div>
						<span className="flex-1 text-base sm:text-lg">{answer}</span>
					</label>
				</div>
			))}
		</div>

		<AnswerImageUpload index={index} control={control} setValue={setValue} />

		<AnimatePresence>
			{error && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					className="mt-6 flex items-center gap-2 text-red-600 dark:text-red-500 text-sm font-black ml-2"
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
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	const handleNext = () => {
		if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handlePrev = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex((prev) => prev - 1);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		control,
		setValue,
	} = useForm({
		resolver: zodResolver(submitQuizSchema),
		mode: "onChange",
	});

	const { data: quiz, isLoading } = useQuiz(id);
	const { data: user, isLoading: isUserLoading } = useUser();
	const { mutate, isPending } = useAddAnswer();
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [formData, setFormData] = useState(null);

	// Check if student has remaining tries
	const attemptsLeft =
		quiz && user && user.role === "student"
			? (quiz.tries || 1) - (quiz.attemptCount || 0)
			: 1;

	// Check if quiz has started
	const isStarted = quiz ? new Date(quiz.startDate) <= new Date() : true;

	useEffect(() => {
		if (quiz && user?.role === "student") {
			if (attemptsLeft <= 0) {
				toast.error("You have exhausted all attempts for this quiz.");
				navigate("/app/home", { replace: true });
			} else if (!isStarted) {
				toast.error(
					`This quiz will start on ${new Date(
						quiz.startDate
					).toLocaleString()}`
				);
				navigate("/app/home", { replace: true });
			}
		}
	}, [quiz, user, attemptsLeft, isStarted, navigate]);

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

	const isPreview = user?.role === "teacher" || user?.role === "admin";

	const performSubmit = useCallback(
		(questions, isAuto = false) => {
			if (isPreview) {
				toast.success("Preview ended");
				navigate("/app/quizzes");
				return;
			}

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
		[id, mutate, navigate, isPreview]
	);

	const onSubmit = useCallback(
		(data) => {
			if (isPreview) {
				performSubmit(null);
				return;
			}
			const answers = data.answer.map((q, index) => {
				const parsed = JSON.parse(q);
				return {
					...parsed,
					image: data.answerImages?.[index],
				};
			});
			setFormData(answers);
			setShowConfirmModal(true);
		},
		[isPreview, performSubmit]
	);

	const handleAutoSubmit = useCallback(() => {
		if (isTimeUp) return;
		setIsTimeUp(true);

		if (isPreview) {
			toast("Timer ended (Preview)", { icon: "clock" });
			return;
		}

		const data = getValues();
		const answers = data.answer || [];
		const images = data.answerImages || [];

		const formattedAnswers = quiz.questions.map((q, index) => {
			const selected = answers[index];
			let baseAnswer = { answer: "", _id: q._id, ques: q.ques };

			if (selected) {
				try {
					baseAnswer =
						typeof selected === "string" ? JSON.parse(selected) : selected;
				} catch (e) {
					baseAnswer = { answer: selected, _id: q._id, ques: q.ques };
				}
			}

			return {
				...baseAnswer,
				image: images[index],
			};
		});

		toast.error("Time is up! Submitting your answers automatically...", {
			duration: 5000,
			icon: "⏰",
		});

		performSubmit(formattedAnswers, true);
	}, [getValues, quiz?.questions, performSubmit, isTimeUp, isPreview]);

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

	if (isLoading || isUserLoading) return <Loader />;

	if (!quiz) {
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
				<div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-[2rem] flex items-center justify-center mb-8 text-red-500 dark:text-red-400 shadow-sm">
					<HiExclamationTriangle className="text-5xl" />
				</div>
				<h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
					Quiz not found
				</h3>
				<p className="text-gray-600 dark:text-white/60 mb-10 font-black">
					The quiz you are looking for does not exist or has been removed.
				</p>
				<button
					onClick={() =>
						navigate(user?.role === "student" ? "/app/home" : "/app/quizzes")
					}
					className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-indigo-500/10 transition-all hover:scale-[1.02] active:scale-95"
				>
					{user?.role === "student" ? "Back to Home" : "Back to Quizzes"}
				</button>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto py-8 sm:py-16 px-4 relative">
			{isPreview && (
				<div className="fixed top-20 right-4 z-40 bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">
					Preview Mode
				</div>
			)}
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
				<div className="flex items-center justify-center gap-3 text-gray-500 dark:text-white/60 font-black text-sm uppercase tracking-widest">
					<HiCheckCircle className="text-indigo-600 dark:text-indigo-400 text-xl" />
					<span>Select the best answer for each question</span>
				</div>
			</motion.div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-8 sm:space-y-12"
			>
				{quiz.questions[currentQuestionIndex] && (
					<QuestionItem
						key={quiz.questions[currentQuestionIndex]._id}
						el={quiz.questions[currentQuestionIndex]}
						index={currentQuestionIndex}
						register={register}
						error={errors?.answer?.[currentQuestionIndex]}
						control={control}
						setValue={setValue}
					/>
				)}

				<div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-8">
					<button
						type="button"
						onClick={handlePrev}
						disabled={currentQuestionIndex === 0}
						className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-lg transition-all ${
							currentQuestionIndex === 0
								? "opacity-0 pointer-events-none"
								: "bg-gray-100 dark:bg-white/[0.05] text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/[0.1] hover:scale-[1.02] active:scale-95"
						}`}
					>
						Previous
					</button>

					{currentQuestionIndex === quiz.questions.length - 1 ? (
						isPreview ? (
							<button
								type="button"
								onClick={() => navigate("/app/quizzes")}
								className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 text-lg"
							>
								Exit Preview
							</button>
						) : (
							<button
								type="submit"
								disabled={isPending || isTimeUp}
								className="w-full sm:w-auto bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg flex items-center justify-center gap-3"
							>
								{isPending ? (
									<>
										<div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
										<span>Submitting...</span>
									</>
								) : (
									"Finish & Submit"
								)}
							</button>
						)
					) : (
						<button
							type="button"
							onClick={handleNext}
							className="w-full sm:w-auto bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95 text-lg"
						>
							Next Question
						</button>
					)}
				</div>
			</form>
		</div>
	);
}
