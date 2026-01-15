import React, { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createQuizSchema } from "../../../shared/validation/schemas";
import { useParams } from "react-router-dom";
import { useCreateQuiz, useQuiz, useUpdateQuiz } from "../hooks/useQuiz";
import Loader from "../../../shared/components/ui/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiTrash } from "react-icons/hi2";
import toast from "react-hot-toast";

export default function CreateQuiz() {
	const { id } = useParams();
	const isEditSession = Boolean(id);
	const { data: quiz, isLoading: isLoadingQuiz } = useQuiz(id);
	const { mutate: createQuiz, isPending: isCreating } = useCreateQuiz();
	const { mutate: updateQuiz, isPending: isUpdating } = useUpdateQuiz();

	const isPending = isCreating || isUpdating;

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(createQuizSchema),
		mode: "onChange",
		defaultValues: {
			quizName: "",
			expire: 1,
			questions: [
				{
					ques: "",
					answers: ["", ""],
					correctAnswer: "",
					Score: 1,
				},
			],
		},
	});

	useEffect(() => {
		if (isEditSession && quiz) {
			reset({
				quizName: quiz.quizName,
				expire: quiz.expire,
				questions: quiz.questions.map((q) => ({
					ques: q.ques,
					answers: q.answers,
					correctAnswer: q.correctAnswer,
					Score: q.Score,
				})),
			});
		}
	}, [isEditSession, quiz, reset]);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "questions",
	});

	const onSubmit = (data) => {
		if (isEditSession) {
			updateQuiz({ id, data });
		} else {
			createQuiz(data);
		}
	};

	if (isLoadingQuiz) return <Loader />;

	return (
		<div className="max-w-4xl mx-auto py-8 px-4">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-8"
			>
				<h1 className="text-3xl font-bold text-gray-900">
					{isEditSession ? "Edit Quiz" : "Create New Quiz"}
				</h1>
				<p className="text-gray-500 mt-2">
					{isEditSession
						? "Modify your quiz details and questions."
						: "Design your quiz and share it with your students."}
				</p>
			</motion.div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				{/* Quiz Basic Info */}
				<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-sm font-semibold text-gray-700 ml-1">
								Quiz Name
							</label>
							<input
								{...register("quizName")}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
								placeholder="e.g. Mathematics Midterm"
							/>
							{errors.quizName && (
								<p className="text-xs text-red-500 ml-1">
									{errors.quizName.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<label className="text-sm font-semibold text-gray-700 ml-1">
								Duration (Hours)
							</label>
							<input
								type="number"
								step="0.1"
								{...register("expire", {
									valueAsNumber: true,
								})}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
							/>
							{errors.expire && (
								<p className="text-xs text-red-500 ml-1">
									{errors.expire.message}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Questions List */}
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-bold text-gray-800">Questions</h2>
						<button
							type="button"
							onClick={() =>
								append({
									ques: "",
									answers: ["", ""],
									correctAnswer: "",
									Score: 1,
								})
							}
							className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-all"
						>
							<HiPlus /> Add Question
						</button>
					</div>

					<AnimatePresence>
						{fields.map((field, index) => (
							<motion.div
								key={field.id}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 relative group"
							>
								<button
									type="button"
									onClick={() => remove(index)}
									className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
								>
									<HiTrash className="text-xl" />
								</button>

								<div className="space-y-4">
									<div className="flex gap-4 items-start">
										<span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm mt-1">
											{index + 1}
										</span>
										<div className="flex-grow space-y-2">
											<input
												{...register(`questions.${index}.ques`)}
												className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium"
												placeholder="Enter your question here..."
											/>
											{errors.questions?.[index]?.ques && (
												<p className="text-xs text-red-500">
													{errors.questions[index].ques.message}
												</p>
											)}
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-12">
										{/* Answers */}
										<div className="space-y-3">
											<label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
												Answer Choices
											</label>
											{[0, 1, 2, 3].map((choiceIndex) => (
												<div key={choiceIndex} className="relative">
													<input
														{...register(
															`questions.${index}.answers.${choiceIndex}`
														)}
														className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm"
														placeholder={`Option ${choiceIndex + 1}`}
													/>
												</div>
											))}
										</div>

										{/* Correct Answer & Score */}
										<div className="space-y-4">
											<div className="space-y-2">
												<label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
													Correct Answer
												</label>
												<select
													{...register(`questions.${index}.correctAnswer`)}
													className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm appearance-none"
												>
													<option value="">Select Correct Answer</option>
													{/* We'll watch the answers array for this question to populate options */}
													<AnswerOptions
														control={control}
														index={index}
														register={register}
													/>
												</select>
											</div>
											<div className="space-y-2">
												<label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
													Points
												</label>
												<input
													type="number"
													{...register(`questions.${index}.Score`, {
														valueAsNumber: true,
													})}
													className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm"
												/>
											</div>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				<div className="pt-6">
					<button
						type="submit"
						disabled={isPending}
						className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
					>
						{isPending
							? isEditSession
								? "Updating Quiz..."
								: "Creating Quiz..."
							: isEditSession
							? "Update Quiz"
							: "Create Quiz"}
					</button>
				</div>
			</form>
		</div>
	);
}

// Helper component to watch answers and update correct answer options
function AnswerOptions({ control, index }) {
	const answers = useWatch({
		control,
		name: `questions.${index}.answers`,
	});

	return (
		<>
			{answers?.map(
				(ans, i) =>
					ans && (
						<option key={i} value={ans}>
							{ans}
						</option>
					)
			)}
		</>
	);
}
