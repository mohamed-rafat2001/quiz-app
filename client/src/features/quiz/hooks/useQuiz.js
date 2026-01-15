import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
	startQuiz,
	getQuiz,
	getAllQuizzes,
	createQuiz,
	deleteQuiz,
	updateQuiz,
} from "../services/quizApi";
import {
	addAnswer,
	getTeacherQuizAnswers,
	getStudentQuizAnswers,
	getQuizAnswer,
	getResultDetails,
} from "../services/quizAnswerApi";

// Quiz Hooks
export function useQuizzes() {
	return useQuery({
		queryKey: ["quizzes"],
		queryFn: getAllQuizzes,
	});
}

export function useQuiz(id) {
	return useQuery({
		queryKey: ["quiz", id],
		queryFn: () => getQuiz(id),
		enabled: !!id,
	});
}

export function useStartQuiz() {
	const navigate = useNavigate();
	return useMutation({
		mutationFn: startQuiz,
		onSuccess: (data) => {
			toast.success("Quiz started!");
			navigate(`/app/quizzes/${data._id}`);
		},
		onError: (err) => {
			toast.error(err.message || "Failed to start quiz");
		},
	});
}

export function useCreateQuiz() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: createQuiz,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["quizzes"] });
			toast.success("Quiz created successfully!");
			navigate("/app/quizzes");
		},
		onError: (err) => {
			toast.error(err.message || "Failed to create quiz");
		},
	});
}

export function useDeleteQuiz() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteQuiz,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["quizzes"] });
			toast.success("Quiz deleted successfully");
		},
		onError: (err) => {
			toast.error(err.message || "Failed to delete quiz");
		},
	});
}

export function useUpdateQuiz() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: updateQuiz,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["quizzes"] });
			toast.success("Quiz updated successfully");
			navigate("/app/quizzes");
		},
		onError: (err) => {
			toast.error(err.message || "Failed to update quiz");
		},
	});
}

// Answer Hooks
export function useAddAnswer() {
	return useMutation({
		mutationFn: addAnswer,
	});
}

export function useTeacherQuizAnswers(id) {
	return useQuery({
		queryKey: ["teacherQuizAnswers", id],
		queryFn: () => getTeacherQuizAnswers(id),
		enabled: !!id,
	});
}

export function useStudentQuizAnswers() {
	return useQuery({
		queryKey: ["studentQuizAnswers"],
		queryFn: getStudentQuizAnswers,
	});
}

export function useQuizAnswer(id) {
	return useQuery({
		queryKey: ["quizAnswer", id],
		queryFn: () => getQuizAnswer(id),
		enabled: !!id,
	});
}

export function useResultDetails(id) {
	return useQuery({
		queryKey: ["resultDetails", id],
		queryFn: () => getResultDetails(id),
		enabled: !!id,
	});
}
