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
} from "react-icons/hi2";

export default function Quizs() {
	const { data: user } = useUser();
	const { data: quizzes, isLoading } = useQuizzes();
	const { mutate: deleteQuiz, isPending: isDeleting } = useDeleteQuiz();

	const isTeacher = user?.role === "teacher";

	const handleDelete = (id) => {
		if (
			window.confirm(
				"Are you sure you want to delete this quiz? This action cannot be undone."
			)
		) {
			deleteQuiz(id, {
				onSuccess: () => toast.success("Quiz deleted successfully"),
			});
		}
	};

	if (isLoading) return <Loader />;

	return (
		<div className="py-4 sm:py-8">
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
						to="/Quizs/Create"
						className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
					>
						<HiPlus className="text-xl" />
						<span>New Quiz</span>
					</Link>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<AnimatePresence>
					{quizzes?.map((quiz, index) => (
						<motion.div
							key={quiz._id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.2, delay: index * 0.05 }}
							className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
						>
							<div className="p-6">
								<div className="flex justify-between items-start mb-4">
									<div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
										<HiDocumentText className="text-2xl" />
									</div>
									{isTeacher && (
										<div className="flex gap-2">
											<Link
												to={`/Quizs/Edit/${quiz._id}`}
												className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
												title="Edit Quiz"
											>
												<HiPencilSquare className="text-xl" />
											</Link>
											<Link
												to={`/Quizs/Answers/${quiz._id}`}
												className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
												title="View Submissions"
											>
												<HiUsers className="text-xl" />
											</Link>
											<button
												onClick={() => handleDelete(quiz._id)}
												disabled={isDeleting}
												className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
												title="Delete Quiz"
											>
												<HiTrash className="text-xl" />
											</button>
										</div>
									)}
								</div>

								<h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
									{quiz.quizName}
								</h3>

								<div className="space-y-3 mb-6">
									<div className="flex items-center gap-3 text-sm text-gray-500">
										<HiQuestionMarkCircle className="text-lg" />
										<span>{quiz.questions?.length || 0} Questions</span>
									</div>
									<div className="flex items-center gap-3 text-sm text-gray-500">
										<HiCalendar className="text-lg" />
										<span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
									</div>
									{isTeacher && (
										<div className="flex items-center gap-3">
											<div
												className={`w-2 h-2 rounded-full ${
													quiz.status === "active"
														? "bg-green-500"
														: "bg-red-500"
												}`}
											/>
											<span
												className={`text-xs font-bold uppercase tracking-wider ${
													quiz.status === "active"
														? "text-green-600"
														: "text-red-600"
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
									<Link
										to={`/singleQuiz/${quiz._id}`}
										className={`flex-1 ${
											isTeacher
												? "bg-gray-50 hover:bg-gray-100 text-gray-700"
												: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100"
										} font-bold py-3 rounded-xl text-center transition-all text-sm flex items-center justify-center gap-2`}
									>
										{!isTeacher && <HiPlay />}
										<span>{isTeacher ? "Preview" : "Start Quiz"}</span>
									</Link>
									{isTeacher && (
										<Link
											to={`/Quizs/Edit/${quiz._id}`}
											className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold py-3 rounded-xl transition-colors text-sm text-center"
										>
											Edit Quiz
										</Link>
									)}
								</div>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{quizzes?.length === 0 && (
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
							to="/Quizs/Create"
							className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-indigo-100 transition-all inline-block"
						>
							Create New Quiz
						</Link>
					)}
				</div>
			)}
		</div>
	);
}
