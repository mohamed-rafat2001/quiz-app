import React, { useEffect, forwardRef } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createQuizSchema } from "../../../shared/validation/schemas";
import { useParams } from "react-router-dom";
import { useCreateQuiz, useQuiz, useUpdateQuiz } from "../hooks/useQuiz";
import Loader from "../../../shared/components/ui/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiTrash } from "react-icons/hi2";

const QuizFormHeader = ({ isEditSession }) => (
	<motion.div
		initial={{ opacity: 0, y: -20 }}
		animate={{ opacity: 1, y: 0 }}
		className="mb-10"
	>
		<h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
			{isEditSession ? "Edit Quiz" : "Create New Quiz"}
		</h1>
		<p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
			{isEditSession
				? "Modify your quiz details and questions."
				: "Design your quiz and share it with your students."}
		</p>
	</motion.div>
);

const QuizBasicInfo = ({ register, errors }) => (
	<div className="bg-white dark:bg-[#0b0f1a] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-8 transition-colors duration-300">
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
			<div className="space-y-2.5">
				<label className="text-sm font-black text-gray-900 dark:text-gray-200 ml-1">
					Quiz Name
				</label>
				<input
					{...register("quizName")}
					className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-gray-900 dark:text-white font-bold focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
					placeholder="e.g. Mathematics Midterm"
				/>
				{errors.quizName && (
					<p className="text-xs text-red-500 ml-1 font-black">
						{errors.quizName.message}
					</p>
				)}
			</div>
			<div className="space-y-2.5">
				<label className="text-sm font-black text-gray-900 dark:text-gray-200 ml-1">
					Time Limit
				</label>
				<div className="flex gap-3">
					<input
						type="number"
						{...register("expire", {
							valueAsNumber: true,
						})}
						placeholder="e.g. 60"
						className="flex-1 px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-gray-900 dark:text-white font-bold focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
					/>
					<select
						{...register("expireUnit")}
						className="px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#151b2b] text-gray-900 dark:text-white font-bold focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all cursor-pointer"
					>
						<option value="minutes">Minutes</option>
						<option value="hours">Hours</option>
					</select>
				</div>
				{errors.expire && (
					<p className="text-xs text-red-500 ml-1 font-black">
						{errors.expire.message}
					</p>
				)}
			</div>
			<div className="space-y-2.5">
				<label className="text-sm font-black text-gray-900 dark:text-gray-200 ml-1">
					Quiz Deadline
				</label>
				<input
					type="datetime-local"
					{...register("expireDate")}
					className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-gray-900 dark:text-white font-bold focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 outline-none transition-all [color-scheme:light] dark:[color-scheme:dark]"
				/>
				{errors.expireDate && (
					<p className="text-xs text-red-500 ml-1 font-black">
						{errors.expireDate.message}
					</p>
				)}
			</div>
			<div className="space-y-2.5">
				<label className="text-sm font-black text-gray-900 dark:text-gray-200 ml-1">
					Allowed Attempts (Tries)
				</label>
				<input
					type="number"
					{...register("tries", {
						valueAsNumber: true,
					})}
					defaultValue={1}
					min={1}
					max={10}
					className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-gray-900 dark:text-white font-bold focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
				/>
				{errors.tries && (
					<p className="text-xs text-red-500 ml-1 font-black">
						{errors.tries.message}
					</p>
				)}
			</div>
		</div>
	</div>
);

const AnswerOptions = ({ control, index, register, errors }) => {
	const answers = useWatch({
		control,
		name: `questions.${index}.answers`,
	});

	return (
		<div className="space-y-4">
			<div className="space-y-2.5">
				<label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">
					Correct Answer
				</label>
				<div className="grid grid-cols-2 gap-3">
					{answers?.map((ans, i) => (
						<label key={i} className="relative cursor-pointer group">
							<input
								type="radio"
								value={ans}
								{...register(`questions.${index}.correctAnswer`)}
								className="peer hidden"
							/>
							<div className="w-full py-3 px-4 rounded-xl border-2 border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 text-xs font-black text-center transition-all peer-checked:border-indigo-600 dark:peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400 group-hover:border-indigo-100 dark:group-hover:border-white/10 truncate">
								{ans || `Option ${i + 1}`}
							</div>
							<div className="absolute -top-1.5 -right-1.5 opacity-0 peer-checked:opacity-100 transition-opacity">
								<div className="bg-indigo-600 dark:bg-indigo-500 text-white rounded-full p-1 shadow-lg">
									<HiPlus className="w-3.5 h-3.5 rotate-45" />
								</div>
							</div>
						</label>
					))}
				</div>
				{errors.questions?.[index]?.correctAnswer && (
					<p className="text-[10px] text-red-500 ml-1 font-black">
						{errors.questions[index].correctAnswer.message}
					</p>
				)}
			</div>
		</div>
	);
};

const QuestionCard = forwardRef(
	({ index, field, register, errors, remove, control }, ref) => (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			className="bg-white dark:bg-[#0b0f1a] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-8 relative group transition-colors duration-300"
		>
			<button
				type="button"
				onClick={() => remove(index)}
				className="absolute top-8 right-8 p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100 active:scale-90"
			>
				<HiTrash className="text-xl" />
			</button>

			<div className="space-y-6">
				<div className="flex gap-6 items-start">
					<span className="shrink-0 w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm mt-1 shadow-sm">
						{index + 1}
					</span>
					<div className="grow space-y-2.5">
						<input
							{...register(`questions.${index}.ques`)}
							className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.03] text-gray-900 dark:text-white font-bold focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
							placeholder="Enter your question here..."
						/>
						{errors.questions?.[index]?.ques && (
							<p className="text-xs text-red-500 font-black ml-1">
								{errors.questions[index].ques.message}
							</p>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-0 md:ml-16">
					<div className="space-y-4">
						<label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">
							Answer Choices
						</label>
						<div className="space-y-3">
							{[0, 1, 2, 3].map((choiceIndex) => (
								<div key={choiceIndex} className="relative">
									<input
										{...register(`questions.${index}.answers.${choiceIndex}`)}
										className="w-full px-5 py-3 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] text-gray-900 dark:text-white font-bold focus:bg-white dark:focus:bg-[#151b2b] focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
										placeholder={`Option ${choiceIndex + 1}`}
									/>
								</div>
							))}
						</div>
					</div>

					<div className="space-y-6">
						<AnswerOptions
							control={control}
							index={index}
							register={register}
							errors={errors}
						/>

						<div className="space-y-2.5">
							<label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">
								Points
							</label>
							<input
								type="number"
								{...register(`questions.${index}.Score`, {
									valueAsNumber: true,
								})}
								className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] text-gray-900 dark:text-white font-black focus:bg-white dark:focus:bg-[#151b2b] focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all text-sm shadow-sm"
							/>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
);

QuestionCard.displayName = "QuestionCard";

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
			expire: 60,
			expireDate: "",
			tries: 1,
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
			const formattedDate = quiz.expireDate
				? new Date(quiz.expireDate).toISOString().slice(0, 16)
				: "";

			reset({
				quizName: quiz.quizName,
				expire: quiz.expire,
				expireDate: formattedDate,
				tries: quiz.tries,
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
			<QuizFormHeader isEditSession={isEditSession} />

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				<QuizBasicInfo register={register} errors={errors} />

				<div className="space-y-8">
					<div className="flex justify-between items-center px-4">
						<h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
							Questions
						</h2>
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
							className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-sm px-6 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
						>
							<HiPlus className="text-lg" /> Add Question
						</button>
					</div>

					<AnimatePresence mode="popLayout">
						{fields.map((field, index) => (
							<QuestionCard
								key={field.id}
								index={index}
								field={field}
								register={register}
								errors={errors}
								remove={remove}
								control={control}
							/>
						))}
					</AnimatePresence>
				</div>

				<div className="pt-10">
					<button
						type="submit"
						disabled={isPending}
						className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-black py-5 rounded-[2.5rem] shadow-xl shadow-indigo-200 dark:shadow-indigo-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-70 hover:scale-[1.02] active:scale-95 text-lg"
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
