import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useQuiz, useAddAnswer } from "../hooks/useQuiz";
import Error from "../../../shared/components/ui/Error";
import Loader from "../../../shared/components/ui/Loader";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function SingleQuiz() {
	const { id } = useParams();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const { data: quiz, isLoading } = useQuiz(id);
	const { mutate, isPending } = useAddAnswer();

	function Submit(data) {
		const questions = data.answer.map((q) => JSON.parse(q));
		mutate(
			{ questions, id },
			{
				onSuccess: () => {
					toast.success("Quiz submitted successfully!");
				},
				onError: (error) => {
					toast.error(error.message || "Failed to submit quiz");
				},
			}
		);
	}

	if (isLoading) return <Loader />;

	return (
		<div className="max-w-4xl mx-auto py-6 sm:py-12 px-4">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center mb-8 sm:mb-12"
			>
				<h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-4">
					{quiz?.quizName}
				</h1>
				<p className="text-sm sm:text-base text-gray-500">
					Please answer all questions carefully before submitting.
				</p>
			</motion.div>

			<form onSubmit={handleSubmit(Submit)} className="space-y-6 sm:space-y-8">
				{quiz?.questions.map((el, index) => (
					<motion.div
						key={el._id}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: index * 0.1 }}
						className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
					>
						<label className="block text-base sm:text-lg font-bold text-gray-800 mb-6">
							<span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-sm mr-3">
								{index + 1}
							</span>
							{el.ques}
						</label>

						<div className="space-y-3">
							{el.answers.map((answer, i) => (
								<div key={i} className="relative">
									<input
										type="radio"
										id={answer + index}
										className="peer hidden"
										{...register(`answer[${index}]`, {
											required: "Please answer all questions",
										})}
										value={JSON.stringify({
											answer: answer,
											_id: el._id,
											ques: el.ques,
										})}
									/>
									<label
										htmlFor={answer + index}
										className="flex items-center px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-gray-100 cursor-pointer transition-all peer-checked:border-indigo-600 peer-checked:bg-indigo-50 hover:bg-gray-50 text-sm sm:text-base text-gray-700 peer-checked:text-indigo-700 font-medium"
									>
										<div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-4 flex items-center justify-center peer-checked:border-indigo-600 transition-colors shrink-0">
											<div className="w-2.5 h-2.5 rounded-full bg-indigo-600 scale-0 transition-transform peer-checked:scale-100" />
										</div>
										{answer}
									</label>
								</div>
							))}
						</div>

						{errors?.answer?.[index] && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="mt-4"
							>
								<Error error={errors.answer[index].message} />
							</motion.div>
						)}
					</motion.div>
				))}

				<motion.div
					className="flex justify-center pt-8"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
				>
					<button
						className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg shadow-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]"
						disabled={isPending}
					>
						{isPending ? (
							<div className="flex items-center justify-center gap-2">
								<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								<span>Submitting...</span>
							</div>
						) : (
							"Submit Quiz"
						)}
					</button>
				</motion.div>
			</form>
		</div>
	);
}
