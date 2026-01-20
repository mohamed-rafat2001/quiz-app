import React, { useEffect, forwardRef } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createQuizSchema } from "../../../shared/validation/schemas";
import { useParams } from "react-router-dom";
import { useCreateQuiz, useQuiz, useUpdateQuiz } from "../hooks/useQuiz";
import Loader from "../../../shared/components/ui/Loader";
import { motion, AnimatePresence } from "framer-motion";
import {
	HiPlus,
	HiTrash,
	HiPhoto,
	HiXMark,
	HiCheckCircle,
	HiExclamationTriangle,
} from "react-icons/hi2";
import { uploadImage, deleteImage } from "../../../shared/services/uploadApi";
import toast from "react-hot-toast";

const QuizFormHeader = ({ isEditSession }) => (
	<motion.div
		initial={{ opacity: 0, y: -20 }}
		animate={{ opacity: 1, y: 0 }}
		className="mb-10"
	>
		<h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
			{isEditSession ? "Edit Quiz" : "Create New Quiz"}
		</h1>
		<p className="text-gray-600 dark:text-white/60 mt-2 font-medium">
			{isEditSession
				? "Modify your quiz details and questions."
				: "Design your quiz and share it with your students."}
		</p>
	</motion.div>
);

const QuizBasicInfo = ({ register, errors }) => (
	<div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6 transition-colors duration-300">
		<h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">
			Quiz Settings
		</h3>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-2">
				<label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
					Quiz Name <span className="text-red-500">*</span>
				</label>
				<input
					{...register("quizName")}
					className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-medium focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
					placeholder="e.g. Mathematics Midterm"
				/>
				{errors.quizName && (
					<p className="text-xs text-red-500 ml-1 font-medium flex items-center gap-1">
						<HiExclamationTriangle className="text-sm" />
						{errors.quizName.message}
					</p>
				)}
			</div>
			<div className="space-y-2">
				<label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
					Time Limit <span className="text-red-500">*</span>
				</label>
				<div className="flex gap-2">
					<input
						type="number"
						{...register("expire", {
							valueAsNumber: true,
						})}
						placeholder="e.g. 60"
						className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-medium focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
					/>
					<select
						{...register("expireUnit")}
						className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-medium focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all cursor-pointer"
					>
						<option value="minutes">Minutes</option>
						<option value="hours">Hours</option>
					</select>
				</div>
				{errors.expire && (
					<p className="text-xs text-red-500 ml-1 font-medium flex items-center gap-1">
						<HiExclamationTriangle className="text-sm" />
						{errors.expire.message}
					</p>
				)}
			</div>
			<div className="space-y-2">
				<label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
					Quiz Start Date <span className="text-red-500">*</span>
				</label>
				<input
					type="datetime-local"
					{...register("startDate")}
					className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-medium focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 outline-none transition-all [color-scheme:light] dark:[color-scheme:dark]"
				/>
				{errors.startDate && (
					<p className="text-xs text-red-500 ml-1 font-medium flex items-center gap-1">
						<HiExclamationTriangle className="text-sm" />
						{errors.startDate.message}
					</p>
				)}
			</div>
			<div className="space-y-2">
				<label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
					Quiz Deadline <span className="text-red-500">*</span>
				</label>
				<input
					type="datetime-local"
					{...register("expireDate")}
					className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-medium focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 outline-none transition-all [color-scheme:light] dark:[color-scheme:dark]"
				/>
				{errors.expireDate && (
					<p className="text-xs text-red-500 ml-1 font-medium flex items-center gap-1">
						<HiExclamationTriangle className="text-sm" />
						{errors.expireDate.message}
					</p>
				)}
			</div>
			<div className="space-y-2">
				<label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
					Allowed Attempts
				</label>
				<input
					type="number"
					{...register("tries", {
						valueAsNumber: true,
					})}
					defaultValue={1}
					min={1}
					max={10}
					className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-medium focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 outline-none transition-all"
				/>
				{errors.tries && (
					<p className="text-xs text-red-500 ml-1 font-medium flex items-center gap-1">
						<HiExclamationTriangle className="text-sm" />
						{errors.tries.message}
					</p>
				)}
			</div>
		</div>
	</div>
);

const AnswerOptions = ({
	control,
	index,
	register,
	errors,
	setValue,
	getValues,
}) => {
	const answers = useWatch({
		control,
		name: `questions.${index}.answers`,
	});

	const correctAnswer = useWatch({
		control,
		name: `questions.${index}.correctAnswer`,
	});

	const handleSelectCorrectAnswer = (answer) => {
		if (answer && answer.trim() !== "") {
			setValue(`questions.${index}.correctAnswer`, answer);
		}
	};

	// Filter out empty answers
	const validAnswers = answers?.filter((ans) => ans && ans.trim() !== "") || [];

	return (
		<div className="space-y-3">
			<label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2">
				<HiCheckCircle className="text-green-500" />
				Select Correct Answer <span className="text-red-500">*</span>
			</label>

			{validAnswers.length === 0 ? (
				<div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
					<p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
						Please fill in the answer options first, then select the correct
						one.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{answers?.map((ans, i) => {
						if (!ans || ans.trim() === "") return null;
						const isSelected = correctAnswer === ans;
						return (
							<button
								key={i}
								type="button"
								onClick={() => handleSelectCorrectAnswer(ans)}
								className={`w-full py-3 px-4 rounded-xl border-2 text-sm font-bold text-left transition-all ${
									isSelected
										? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
										: "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/10"
								}`}
							>
								<div className="flex items-center gap-3">
									<div
										className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
											isSelected
												? "border-green-500 bg-green-500"
												: "border-gray-300 dark:border-gray-500"
										}`}
									>
										{isSelected && (
											<HiCheckCircle className="text-white text-xs" />
										)}
									</div>
									<span className="truncate">{ans}</span>
								</div>
							</button>
						);
					})}
				</div>
			)}

			{/* Hidden input for form validation */}
			<input type="hidden" {...register(`questions.${index}.correctAnswer`)} />

			{errors.questions?.[index]?.correctAnswer && (
				<p className="text-xs text-red-500 ml-1 font-medium flex items-center gap-1">
					<HiExclamationTriangle className="text-sm" />
					{errors.questions[index].correctAnswer.message}
				</p>
			)}
		</div>
	);
};

const QuestionImageUpload = ({ index, control, setValue, questionText }) => {
	const image = useWatch({
		control,
		name: `questions.${index}.image`,
	});
	const [isUploading, setIsUploading] = React.useState(false);

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		try {
			setIsUploading(true);
			const data = await uploadImage(file);
			setValue(`questions.${index}.image`, data);
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
			setValue(`questions.${index}.image`, undefined);
			toast.success("Image removed");
		} catch (err) {
			toast.error(err.message);
		}
	};

	return (
		<div className="mt-4">
			{image ? (
				<div className="relative inline-block group/img">
					<img
						src={image.secure_url}
						alt={`Question ${index + 1} image: ${questionText || "Question image"}`}
						className="w-full max-h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
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
						className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-600"
					>
						<HiXMark className="text-sm" />
					</button>
				</div>
			) : (
				<label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group">
					<div className="flex flex-col items-center justify-center py-4">
						{isUploading ? (
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
						) : (
							<>
								<HiPhoto className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 transition-colors mb-1" />
								<p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
									Add image (optional)
								</p>
							</>
						)}
					</div>
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

const QuestionCard = forwardRef(
	(
		{ index, field, register, errors, remove, control, setValue, getValues },
		ref
	) => {
		const questionText = useWatch({
			control,
			name: `questions.${index}.ques`,
		});

		return (
			<motion.div
				ref={ref}
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6 relative group transition-colors duration-300"
			>
				{/* Delete Button */}
				<button
					type="button"
					onClick={() => remove(index)}
					className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100 active:scale-90"
					title="Delete question"
				>
					<HiTrash className="text-lg" />
				</button>

				{/* Question Header */}
				<div className="flex gap-4 items-start pr-10">
					<span className="shrink-0 w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm shadow-sm">
						{index + 1}
					</span>
					<div className="grow space-y-2">
						<label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
							Question <span className="text-red-500">*</span>
						</label>
						<input
							{...register(`questions.${index}.ques`)}
							className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-medium focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
							placeholder="Enter your question here..."
						/>
						{errors.questions?.[index]?.ques && (
							<p className="text-xs text-red-500 font-medium flex items-center gap-1">
								<HiExclamationTriangle className="text-sm" />
								{errors.questions[index].ques.message}
							</p>
						)}
						<QuestionImageUpload
							index={index}
							control={control}
							setValue={setValue}
							questionText={questionText}
						/>
					</div>
				</div>

			{/* Answer Options */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ml-0 sm:ml-14">
				{/* Left: Answer Choices */}
				<div className="space-y-3">
					<label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">
						Answer Choices <span className="text-red-500">*</span>
					</label>
					<div className="space-y-2">
						{[0, 1, 2, 3].map((choiceIndex) => (
							<div key={choiceIndex} className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 dark:text-gray-500">
									{String.fromCharCode(65 + choiceIndex)}.
								</span>
								<input
									{...register(`questions.${index}.answers.${choiceIndex}`)}
									className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-medium focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
									placeholder={`Option ${choiceIndex + 1}`}
								/>
							</div>
						))}
					</div>
				</div>

				{/* Right: Correct Answer + Points */}
				<div className="space-y-6">
					<AnswerOptions
						control={control}
						index={index}
						register={register}
						errors={errors}
						setValue={setValue}
						getValues={getValues}
					/>

					<div className="space-y-2">
						<label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">
							Points
						</label>
						<input
							type="number"
							{...register(`questions.${index}.Score`, {
								valueAsNumber: true,
							})}
							min={1}
							className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-medium focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all text-sm"
							placeholder="1"
						/>
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
		setValue,
		getValues,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(createQuizSchema),
		mode: "onChange",
		defaultValues: {
			quizName: "",
			expire: 60,
			expireUnit: "minutes",
			expireDate: "",
			startDate: new Date().toISOString().slice(0, 16),
			tries: 1,
			questions: [
				{
					ques: "",
					answers: ["", "", "", ""],
					correctAnswer: "",
					Score: 1,
				},
			],
		},
	});

	useEffect(() => {
		if (isEditSession && quiz) {
			const formattedExpireDate = quiz.expireDate
				? new Date(quiz.expireDate).toISOString().slice(0, 16)
				: "";
			const formattedStartDate = quiz.startDate
				? new Date(quiz.startDate).toISOString().slice(0, 16)
				: new Date().toISOString().slice(0, 16);

			reset({
				quizName: quiz.quizName,
				expire: quiz.expire,
				expireUnit: quiz.expireUnit || "minutes",
				expireDate: formattedExpireDate,
				startDate: formattedStartDate,
				tries: quiz.tries,
				questions: quiz.questions.map((q) => ({
					ques: q.ques,
					answers:
						q.answers.length >= 4
							? q.answers
							: [...q.answers, "", "", "", ""].slice(0, 4),
					correctAnswer: q.correctAnswer,
					Score: q.Score,
					image: q.image,
				})),
			});
		}
	}, [isEditSession, quiz, reset]);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "questions",
	});

	const onSubmit = (data) => {
		// Clean up data - filter empty answers
		const cleanedData = {
			...data,
			questions: data.questions.map((q) => ({
				...q,
				answers: q.answers.filter((a) => a && a.trim() !== ""),
			})),
		};

		if (isEditSession) {
			updateQuiz({ id, data: cleanedData });
		} else {
			createQuiz(cleanedData);
		}
	};

	if (isLoadingQuiz) return <Loader />;

	return (
		<div className="max-w-4xl mx-auto py-8 px-4">
			<QuizFormHeader isEditSession={isEditSession} />

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				<QuizBasicInfo register={register} errors={errors} />

				<div className="space-y-6">
					<div className="flex justify-between items-center px-2">
						<div>
							<h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
								Questions
							</h2>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
								Add at least 2 answer options per question
							</p>
						</div>
						<button
							type="button"
							onClick={() =>
								append({
									ques: "",
									answers: ["", "", "", ""],
									correctAnswer: "",
									Score: 1,
								})
							}
							className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all hover:scale-[1.02] active:scale-95"
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
								setValue={setValue}
								getValues={getValues}
							/>
						))}
					</AnimatePresence>
				</div>

				<div className="pt-6">
					<button
						type="submit"
						disabled={isPending}
						className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 hover:scale-[1.01] active:scale-[0.99] text-lg"
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
