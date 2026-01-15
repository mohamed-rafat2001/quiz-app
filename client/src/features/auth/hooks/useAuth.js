import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	login as loginApi,
	signUp as signUpApi,
	getMe,
	logout as logoutApi,
	updateMe,
	updatePassword,
} from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function useLogin() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: loginApi,
		onSuccess: (data) => {
			queryClient.setQueryData(["user"], data.user);
			toast.success("Logged in successfully!");
			navigate("/app/dashboard", { replace: true });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to login");
		},
	});
}

export function useSignUp() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: signUpApi,
		onSuccess: (data) => {
			const user = data.user;
			queryClient.setQueryData(["user"], user);
			toast.success("Account created successfully!");
			navigate("/app/dashboard", { replace: true });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to sign up");
		},
	});
}

export function useUser() {
	return useQuery({
		queryKey: ["user"],
		queryFn: getMe,
		retry: false,
		staleTime: Infinity,
	});
}

export function useUpdateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateMe,
		onSuccess: (user) => {
			queryClient.setQueryData(["user"], user);
			toast.success("Profile updated successfully!");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update profile");
		},
	});
}

export function useUpdatePassword() {
	return useMutation({
		mutationFn: updatePassword,
		onSuccess: () => {
			toast.success("Password updated successfully!");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update password");
		},
	});
}

export function useLogout() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { mutate: logout } = useMutation({
		mutationFn: logoutApi,
		onSuccess: () => {
			queryClient.setQueryData(["user"], null);
			queryClient.removeQueries();
			navigate("/", { replace: true });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to logout");
		},
	});

	return logout;
}
