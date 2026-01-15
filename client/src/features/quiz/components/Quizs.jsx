import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { useQuizzes, useDeleteQuiz } from "../hooks/useQuiz";
import { useUser } from "../../auth/hooks/useAuth";
import Loader from "../../../shared/components/ui/Loader";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
	HiPlus,
	HiDocumentText,
	HiUsers,
	HiTrash,
	HiQuestionMarkCircle,
	HiCalendar,
	HiDocumentMinus,
	HiPencilSquare,
	HiPlay,
	HiCheckCircle,
	HiXCircle,
	HiInformationCircle,
} from "react-icons/hi2";

const QuizHeader = ({ isTeacher }) => (
	<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-10">
		<div>
			<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
				{isTeacher ? "Manage Quizzes" : "Available Quizzes"}
			</h1>
			<p className="text-sm sm:text-base text-gray-500 mt-1">
				{isTeacher
					? "Create, edit, and track your classroom quizzes"
					: "Browse and take quizzes to test your knowledge"}
			</p>
		</div>
		{isTeacher && (
			<Link
				to="/app/quizzes/create"
				className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
			>
				<HiPlus className="text-xl" />
				<span>New Quiz</span>
			</Link>
		)}
	</div>
);

const QuizCard = forwardRef(
	({ quiz, index, isTeacher, isDeleting, onDelete }, ref) => {
		const hasTaken = !isTeacher && quiz.userResult;
		const isPassed = hasTaken && quiz.userResult.status;

		return (
			<motion.div
				ref={ref}
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.2, delay: index * 0.05 }}
				className={`bg-white rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group ${
					hasTaken
						? isPassed
							? "border-green-100 bg-green-50/10"
							: "border-red-100 bg-red-50/10"
						: "border-gray-100"
				}`}
			>
				<div className="p-6">
					<div className="flex justify-between items-start mb-4">
						<div
							className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
								hasTaken
									? isPassed
										? "bg-green-100 text-green-600"
										: "bg-red-100 text-red-600"
									: "bg-indigo-50 text-indigo-600"
							}`}
						>
							{hasTaken ? (
								isPassed ? (
									<HiCheckCircle className="text-2xl" />
								) : (
									<HiXCircle className="text-2xl" />
								)
							) : (
								<HiDocumentText className="text-2xl" />
							)}
						</div>
						{isTeacher ? (
							<div className="flex gap-2">
								<Link
									to={`/app/quizzes/edit/${quiz._id}`}
									className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
									title="Edit Quiz"
								>
									<HiPencilSquare className="text-xl" />
								</Link>
								<Link
									to={`/app/quizzes/submissions/${quiz._id}`}
									className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
									title="View Submissions"
								>
									<HiUsers className="text-xl" />
								</Link>
								<button
									onClick={() => onDelete(quiz._id)}
									disabled={isDeleting}
									className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
									title="Delete Quiz"
								>
									<HiTrash className="text-xl" />
								</button>
							</div>
						) : (
							hasTaken && (
								<div
									className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
										isPassed
											? "bg-green-100 text-green-600"
											: "bg-red-100 text-red-600"
									}`}
								>
									{isPassed ? "Passed" : "Failed"}
								</div>
							)
						)}
					</div>

					<h3
						className={`text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors ${
							hasTaken
								? isPassed
									? "text-green-800"
									: "text-red-800"
								: "text-gray-800"
						}`}
					>
						{quiz.quizName}
					</h3>

					<div className="space-y-3 mb-6">
						<div className="flex items-center gap-3 text-sm text-gray-500">
							<HiQuestionMarkCircle className="text-lg" />
							<span>{quiz.questions?.length || 0} Questions</span>
						</div>

						{isTeacher && (
							<div className="flex items-center gap-3 text-sm text-gray-500">
								<HiUsers className="text-lg" />
								<span>{quiz.numberTookQuiz || 0} Students Taken</span>
							</div>
						)}

						{hasTaken ? (
							<div className="flex items-center gap-3 text-sm font-bold">
								<HiInformationCircle className="text-lg" />
								<span className={isPassed ? "text-green-600" : "text-red-600"}>
									Score: {quiz.userResult.totalScore} / {quiz.quizScore}
								</span>
							</div>
						) : (
							<div className="flex items-center gap-3 text-sm text-gray-500">
								<HiCalendar className="text-lg" />
								<span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
							</div>
						)}

						{isTeacher && (
							<div className="flex items-center gap-3">
								<div
									className={`w-2 h-2 rounded-full ${
										quiz.status === "active" ? "bg-green-500" : "bg-red-500"
									}`}
								/>
								<span
									className={`text-xs font-bold uppercase tracking-wider ${
										quiz.status === "active" ? "text-green-600" : "text-red-600"
									}`}
								>
									{quiz.status || "active"}
								</span>
							</div>
						)}

						{isTeacher && (
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-3 text-xs font-mono bg-gray-50 p-2 rounded-lg border border-gray-100">
									<span className="text-gray-400">ID:</span>
									<span className="text-gray-900 font-bold select-all">
										{quiz.quizId}
									</span>
									<button
										onClick={() => {
											navigator.clipboard.writeText(quiz.quizId);
											toast.success("Quiz ID copied!");
										}}
										className="ml-auto text-indigo-600 hover:text-indigo-700"
									>
										Copy
									</button>
								</div>
								<div className="flex items-center gap-3 text-xs font-mono bg-gray-50 p-2 rounded-lg border border-gray-100">
									<span className="text-gray-400">Pass:</span>
									<span className="text-gray-900 font-bold select-all">
										{quiz.quizPassword}
									</span>
									<button
										onClick={() => {
											navigator.clipboard.writeText(quiz.quizPassword);
											toast.success("Password copied!");
										}}
										className="ml-auto text-indigo-600 hover:text-indigo-700"
									>
										Copy
									</button>
								</div>
							</div>
						)}
					</div>

					<div className="flex gap-3">
						{hasTaken ? (
							<Link
								to={`/app/my-submissions/${quiz.userResult._id}`}
								className={`flex-1 font-bold py-3 rounded-xl text-center transition-all text-sm flex items-center justify-center gap-2 ${
									isPassed
										? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100"
										: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100"
								}`}
							>
								<HiInformationCircle className="text-lg" />
								<span>View Result</span>
							</Link>
						) : (
							<Link
								to={`/app/quizzes/${quiz._id}`}
								className={`flex-1 ${
									isTeacher
										? "bg-gray-50 hover:bg-gray-100 text-gray-700"
										: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100"
								} font-bold py-3 rounded-xl text-center transition-all text-sm flex items-center justify-center gap-2`}
							>
								{!isTeacher && <HiPlay />}
								<span>{isTeacher ? "Preview" : "Start Quiz"}</span>
							</Link>
						)}

						{isTeacher && (
							<Link
								to={`/app/quizzes/edit/${quiz._id}`}
								className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold py-3 rounded-xl transition-colors text-sm text-center"
							>
								Edit Quiz
							</Link>
						)}
					</div>
				</div>
			</motion.div>
		);
	}
);

QuizCard.displayName = "QuizCard";

const EmptyState = ({ isTeacher }) => (
	<div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
		<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
			<HiDocumentMinus className="text-4xl" />
		</div>
		<h3 className="text-xl font-bold text-gray-800">
			{isTeacher ? "No quizzes yet" : "No quizzes available"}
		</h3>
		<p className="text-gray-500 mt-2 mb-6">
			{isTeacher
				? "Create your first quiz to get started"
				: "Check back later for new quizzes from your teachers"}
		</p>
		{isTeacher && (
			<Link
				to="/app/quizzes/create"
				className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-indigo-100 transition-all inline-block"
			>
				Create New Quiz
			</Link>
		)}
	</div>
);

export default function Quizs() {
	const { data: user } = useUser();
	const { data: quizzes, isLoading, error } = useQuizzes();
	const { mutate: deleteQuiz, isPending: isDeleting } = useDeleteQuiz();

	const isTeacher = user?.role === "teacher";

	const handleDelete = (id) => {
		if (
			window.confirm(
				"Are you sure you want to delete this quiz? This action cannot be undone."
			)
		) {
			deleteQuiz(id);
		}
	};

	if (isLoading) return <Loader />;

	if (error) {
		return (
			<div className="py-20 text-center">
				<div className="bg-red-50 text-red-600 p-6 rounded-3xl inline-block">
					<p className="font-bold">Error loading quizzes</p>
					<p className="text-sm opacity-80">{error.message}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="py-4 sm:py-8">
			<QuizHeader isTeacher={isTeacher} />

			{Array.isArray(quizzes) && quizzes.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<AnimatePresence mode="popLayout">
						{quizzes.map((quiz, index) => (
							<QuizCard
								key={quiz._id}
								quiz={quiz}
								index={index}
								isTeacher={isTeacher}
								isDeleting={isDeleting}
								onDelete={handleDelete}
							/>
						))}
					</AnimatePresence>
				</div>
			) : (
				<EmptyState isTeacher={isTeacher} />
			)}
		</div>
	);
}
