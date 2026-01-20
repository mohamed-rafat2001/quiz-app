import React, { forwardRef, useState, useEffect } from "react";
import Pagination from "../../../shared/components/ui/Pagination";
import { Link, Navigate } from "react-router-dom";
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
	HiClock,
	HiMagnifyingGlass,
	HiTrophy,
} from "react-icons/hi2";

const QuizHeader = ({ isTeacher, searchTerm, onSearchChange }) => (
	<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8 sm:mb-10">
		<div className="flex-1">
			<h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
				{isTeacher ? "Manage Quizzes" : "Available Quizzes"}
			</h1>
			<p className="text-sm sm:text-base text-gray-500 dark:text-white/60 mt-1 font-medium">
				{isTeacher
					? "Create, edit, and track your classroom quizzes"
					: "Browse and take quizzes to test your knowledge"}
			</p>
		</div>

		<div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
			<div className="relative w-full sm:w-80">
				<HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 text-lg" />
				<input
					type="text"
					placeholder="Search quiz name or ID..."
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
					className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-white/[0.05] border border-gray-200/60 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30"
				/>
			</div>

			{isTeacher && (
				<Link
					to="/app/quizzes/create"
					className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 px-8 rounded-2xl shadow-xl shadow-indigo-200/50 dark:shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap group active:scale-95"
				>
					<HiPlus className="text-xl group-hover:rotate-90 transition-transform duration-300" />
					<span>New Quiz</span>
				</Link>
			)}
		</div>
	</div>
);

const QuizCard = forwardRef(
	({ quiz, index, isTeacher, isDeleting, onDelete }, ref) => {
		const hasTaken = !isTeacher && quiz.userResult;
		const isPassed = hasTaken && quiz.userResult.status;
		const attemptsLeft = !isTeacher
			? (quiz.tries || 1) - (quiz.attemptCount || 0)
			: 0;
		const canTakeAgain = !isTeacher && attemptsLeft > 0;
		const isStarted = new Date(quiz.startDate) <= new Date();
		const isExpired = new Date(quiz.expireDate) <= new Date();

		return (
			<motion.div
				ref={ref}
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.2, delay: index * 0.05 }}
				className={`bg-white dark:bg-white/[0.03] rounded-[2.5rem] border transition-all duration-300 overflow-hidden group hover:-translate-y-1 ${
					hasTaken
						? isPassed
							? "border-green-100 dark:border-green-500/20 bg-green-50/10 dark:bg-green-500/[0.02] shadow-green-100/20 shadow-xl"
							: "border-red-100 dark:border-red-500/20 bg-red-50/10 dark:bg-red-500/[0.02] shadow-red-100/20 shadow-xl"
						: "border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 dark:hover:shadow-black/40"
				}`}
			>
				<div className="p-8">
					<div className="flex justify-between items-start mb-6">
						<div
							className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm ${
								hasTaken
									? isPassed
										? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
										: "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
									: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
							}`}
						>
							{hasTaken && !canTakeAgain ? (
								isPassed ? (
									<HiCheckCircle className="text-3xl" />
								) : (
									<HiXCircle className="text-3xl" />
								)
							) : (
								<HiDocumentText className="text-3xl" />
							)}
						</div>
						{isTeacher ? (
							<div className="flex gap-2">
								<Link
									to={`/app/quizzes/edit/${quiz._id}`}
									className="p-3 text-gray-400 dark:text-white/40 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-xl transition-all active:scale-90"
									title="Edit Quiz"
								>
									<HiPencilSquare className="text-xl" />
								</Link>
								<Link
									to={`/app/quizzes/submissions/${quiz._id}`}
									className="p-3 text-gray-400 dark:text-white/40 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all active:scale-90"
									title="View Submissions"
								>
									<HiUsers className="text-xl" />
								</Link>
								<button
									onClick={() => onDelete(quiz._id)}
									disabled={isDeleting}
									className="p-3 text-gray-400 dark:text-white/40 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all active:scale-90 disabled:opacity-50"
									title="Delete Quiz"
								>
									<HiTrash className="text-xl" />
								</button>
							</div>
						) : (
							<div className="flex flex-col items-end gap-1">
								{hasTaken && (
									<div
										className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
											isPassed
												? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
												: "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
										}`}
									>
										{isPassed ? "Best: Passed" : "Best: Failed"}
									</div>
								)}
								<div className="px-4 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 rounded-full text-[10px] font-black uppercase tracking-widest">
									{attemptsLeft} Tries Left
								</div>
							</div>
						)}
					</div>

					<h3
						className={`text-xl font-black mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${
							hasTaken && !canTakeAgain
								? isPassed
									? "text-green-900 dark:text-green-400"
									: "text-red-900 dark:text-red-400"
								: "text-gray-900 dark:text-white"
						}`}
					>
						{quiz.quizName}
					</h3>

					<div className="space-y-3 mb-6">
						<div className="flex items-center gap-3 text-sm font-bold text-gray-500 dark:text-white/60">
							<HiQuestionMarkCircle className="text-lg text-gray-400 dark:text-white/40" />
							<span>{quiz.questions?.length || 0} Questions</span>
						</div>

						<div className="flex items-center gap-3 text-sm font-bold text-gray-500 dark:text-white/60">
							<HiClock className="text-lg text-gray-400 dark:text-white/40" />
							<span className="capitalize">
								{quiz.expire} {quiz.expireUnit || "minutes"} Limit
							</span>
						</div>

						{isTeacher && (
							<div className="flex items-center gap-3 text-sm font-bold text-gray-500 dark:text-white/60">
								<HiUsers className="text-lg text-gray-400 dark:text-white/40" />
								<span>{quiz.numberTookQuiz || 0} Students Taken</span>
							</div>
						)}

						<div className="flex items-center gap-3 text-sm font-bold text-gray-500 dark:text-white/60">
							<HiCalendar className="text-lg text-gray-400 dark:text-white/40" />
							<div className="flex flex-col">
								<span className={`text-xs ${!isStarted && !isTeacher ? "text-amber-600 dark:text-amber-400" : ""}`}>
									Starts:{" "}
									{new Date(quiz.startDate).toLocaleString([], {
										dateStyle: "short",
										timeStyle: "short",
									})}
								</span>
								<span className="text-xs">
									Ends:{" "}
									{new Date(quiz.expireDate).toLocaleString([], {
										dateStyle: "short",
										timeStyle: "short",
									})}
								</span>
							</div>
						</div>

						{isTeacher && (
							<div className="flex items-center gap-3 text-sm font-bold text-gray-500 dark:text-white/60">
								<HiPlay className="text-lg text-gray-400 dark:text-white/40" />
								<span>Max Attempts: {quiz.tries || 1}</span>
							</div>
						)}

						{hasTaken && (
							<div className="flex items-center gap-3 text-sm font-black">
								<HiInformationCircle className="text-lg opacity-70" />
								<span
									className={
										isPassed
											? "text-green-600 dark:text-green-400"
											: "text-red-600 dark:text-red-400"
									}
								>
									Best Score: {quiz.userResult.totalScore} / {quiz.quizScore}
								</span>
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
									className={`text-[10px] font-black uppercase tracking-widest ${
										quiz.status === "active"
											? "text-green-600 dark:text-green-400"
											: "text-red-600 dark:text-red-400"
									}`}
								>
									{quiz.status || "active"}
								</span>
							</div>
						)}

						{isTeacher && quiz.stats && (
							<div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 grid grid-cols-3 gap-3">
								<div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-3 border border-gray-100/50 dark:border-white/5">
									<p className="text-[10px] text-gray-400 dark:text-white/40 font-black uppercase tracking-wider mb-1">
										Avg Score
									</p>
									<p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
										{quiz.stats.avgScore.toFixed(1)}%
									</p>
								</div>
								<div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-3 border border-gray-100/50 dark:border-white/5">
									<p className="text-[10px] text-gray-400 dark:text-white/40 font-black uppercase tracking-wider mb-1">
										Highest
									</p>
									<p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
										{quiz.stats.highestScore.toFixed(1)}%
									</p>
								</div>
								<div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-3 border border-gray-100/50 dark:border-white/5">
									<p className="text-[10px] text-gray-400 dark:text-white/40 font-black uppercase tracking-wider mb-1">
										Subs
									</p>
									<p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
										{quiz.stats.totalAttempts}
									</p>
								</div>
							</div>
						)}

						{isTeacher && (
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-3 text-xs font-mono bg-gray-50 dark:bg-white/[0.03] p-2 rounded-lg border border-gray-100 dark:border-white/5">
									<span className="text-gray-400 dark:text-white/40">ID:</span>
									<span className="text-gray-900 dark:text-white/80 font-bold select-all">
										{quiz.quizId}
									</span>
									<button
										onClick={() => {
											navigator.clipboard.writeText(quiz.quizId);
											toast.success("Quiz ID copied!");
										}}
										className="ml-auto text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-black"
									>
										Copy
									</button>
								</div>
								<div className="flex items-center gap-3 text-xs font-mono bg-gray-50 dark:bg-white/[0.03] p-2 rounded-lg border border-gray-100 dark:border-white/5">
									<span className="text-gray-400 dark:text-white/40">
										Pass:
									</span>
									<span className="text-gray-900 dark:text-white/80 font-bold select-all">
										{quiz.quizPassword}
									</span>
									<button
										onClick={() => {
											navigator.clipboard.writeText(quiz.quizPassword);
											toast.success("Password copied!");
										}}
										className="ml-auto text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-black"
									>
										Copy
									</button>
								</div>
							</div>
						)}
					</div>

					<div className="flex gap-3">
						{hasTaken && !canTakeAgain ? (
							<Link
								to={`/app/my-submissions/${quiz.userResult._id}`}
								className={`flex-1 font-black py-3.5 rounded-2xl text-center transition-all text-sm flex items-center justify-center gap-2 active:scale-95 ${
									isPassed
										? "bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-200/50 dark:shadow-green-900/20"
										: "bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-200/50 dark:shadow-red-900/20"
								}`}
							>
								<HiInformationCircle className="text-lg" />
								<span>View Result</span>
							</Link>
						) : (
							<Link
								to={!isTeacher && !isStarted ? "#" : `/app/quizzes/${quiz._id}`}
								onClick={(e) => {
									if (!isTeacher && !isStarted) {
										e.preventDefault();
										toast.error(
											`This quiz will start on ${new Date(
												quiz.startDate
											).toLocaleString()}`
										);
									}
								}}
								className={`flex-1 ${
									isTeacher
										? "bg-gray-100 dark:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-white/[0.1] text-gray-700 dark:text-white/80"
										: !isStarted
										? "bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-white/20 cursor-not-allowed"
										: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200/50 dark:shadow-indigo-900/20"
								} font-black py-3.5 rounded-2xl text-center transition-all text-sm flex items-center justify-center gap-2 active:scale-95`}
							>
								{!isTeacher && <HiPlay />}
								<span>
									{isTeacher
										? "Preview"
										: !isStarted
										? "Upcoming"
										: hasTaken && canTakeAgain
										? "Retake Quiz"
										: "Start Quiz"}
								</span>
							</Link>
						)}

						{hasTaken && canTakeAgain && (
							<Link
								to={`/app/my-submissions/${quiz.userResult._id}`}
								className="px-4 bg-gray-100 dark:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-white/[0.1] text-gray-600 dark:text-white/40 font-black py-3.5 rounded-2xl transition-all text-sm text-center flex items-center justify-center active:scale-95"
								title="View Best Result"
							>
								<HiInformationCircle className="text-lg" />
							</Link>
						)}

						{isTeacher && (
							<Link
								to={`/app/quizzes/edit/${quiz._id}`}
								className="flex-1 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-black py-3.5 rounded-2xl transition-all text-sm text-center active:scale-95"
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
	<div className="text-center py-20 bg-white dark:bg-white/[0.03] rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-white/5 transition-colors duration-300">
		<div className="w-20 h-20 bg-gray-50 dark:bg-white/[0.03] rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300 dark:text-gray-600 shadow-inner">
			<HiDocumentMinus className="text-4xl" />
		</div>
		<h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
			{isTeacher ? "No quizzes yet" : "No quizzes available"}
		</h3>
		<p className="text-gray-500 dark:text-white/60 mt-2 mb-8 font-medium">
			{isTeacher
				? "Create your first quiz to get started"
				: "Check back later for new quizzes from your teachers"}
		</p>
		{isTeacher && (
			<Link
				to="/app/quizzes/create"
				className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-indigo-200/50 dark:shadow-indigo-900/20 transition-all inline-flex items-center gap-2 active:scale-95"
			>
				<HiPlus className="text-xl" />
				<span>Create New Quiz</span>
			</Link>
		)}
	</div>
);

export default function Quizs() {
	const { data: user } = useUser();
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [page, setPage] = useState(1);

	if (user?.role === "student") {
		return <Navigate to="/app/dashboard" replace />;
	}

	// Debounce search term and reset page
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchTerm);
			setPage(1);
		}, 500);
		return () => clearTimeout(timer);
	}, [searchTerm]);

	const isTeacher = user?.role === "teacher";

	const {
		data: response,
		isLoading,
		error,
	} = useQuizzes({ keyword: debouncedSearch, page, limit: 9 }, isTeacher);

	const quizzes = response?.data || [];
	const meta = response?.meta || {};

	const { mutate: deleteQuiz, isPending: isDeleting } = useDeleteQuiz();

	const handleDelete = (id) => {
		if (
			window.confirm(
				"Are you sure you want to delete this quiz? This action cannot be undone."
			)
		) {
			deleteQuiz(id);
		}
	};

	if (isLoading && !debouncedSearch) return <Loader />;

	if (error) {
		return (
			<div className="py-20 text-center">
				<div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-8 rounded-[2.5rem] inline-block border border-red-100 dark:border-red-500/20 shadow-xl shadow-red-100/20">
					<p className="font-black text-lg mb-1">Error loading quizzes</p>
					<p className="text-sm font-bold opacity-80">{error.message}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="py-4 sm:py-8">
			<QuizHeader
				isTeacher={isTeacher}
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
			/>

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

			{!isLoading && quizzes.length > 0 && (
				<Pagination
					page={meta.page || page}
					limit={meta.limit || 9}
					total={meta.total || 0}
					onPageChange={setPage}
					className="justify-center mt-10"
				/>
			)}
		</div>
	);
}
