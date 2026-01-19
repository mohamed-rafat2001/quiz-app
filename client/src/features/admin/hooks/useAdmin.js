import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getAllUsers,
	createUserByAdmin,
	deleteUser,
	updateUser,
	getAllQuizzes,
	deleteQuizByAdmin,
} from "../services/adminApi";
import { toast } from "react-hot-toast";

export const useAdminUsers = (params) => {
	return useQuery({
		queryKey: ["adminUsers", params],
		queryFn: () => getAllUsers(params),
	});
};

export const useDeleteUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			toast.success("User deleted successfully");
			queryClient.invalidateQueries(["adminUsers"]);
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Failed to delete user");
		},
	});
};

export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateUser,
		onSuccess: () => {
			toast.success("User updated successfully");
			queryClient.invalidateQueries(["adminUsers"]);
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Failed to update user");
		},
	});
};

export const useCreateUserByAdmin = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createUserByAdmin,
		onSuccess: () => {
			toast.success("User created successfully");
			queryClient.invalidateQueries(["adminUsers"]);
		},
		onError: (err) => {
			toast.error(err.message || "Failed to create user");
		},
	});
};

export const useAdminQuizzes = (params) => {
	return useQuery({
		queryKey: ["adminQuizzes", params],
		queryFn: () => getAllQuizzes(params),
	});
};

export const useDeleteQuizAdmin = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteQuizByAdmin,
		onSuccess: () => {
			toast.success("Quiz deleted successfully");
			queryClient.invalidateQueries(["adminQuizzes"]);
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Failed to delete quiz");
		},
	});
};
