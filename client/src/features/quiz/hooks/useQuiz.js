import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
	startQuiz,
	getQuiz,
	getAllQuizzes,
	createQuiz,
	deleteQuiz,
} from "../services/quizApi";
import {
	addAnswer,
	getTeacherQuizAnswers,
	getStudentQuizAnswers,
	getQuizAnswer,
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
			navigate(`/singleQuiz/${data._id}`);
		},
	});
}

export function useCreateQuiz() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createQuiz,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["quizzes"] });
		},
	});
}

export function useDeleteQuiz() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteQuiz,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["quizzes"] });
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
