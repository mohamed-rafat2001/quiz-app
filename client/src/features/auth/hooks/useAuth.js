import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	login as loginApi,
	signUp as signUpApi,
	getMe,
	logout as logoutApi,
	updateMe,
	deleteMeImage,
	updatePassword,
	forgotPassword as forgotPasswordApi,
	resetPassword as resetPasswordApi,
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

			// Small delay to show the "success" state before redirecting to animated dashboard
			setTimeout(() => {
				navigate("/app/dashboard", { replace: true });
			}, 500);
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
		mutationFn: ({ data, onUploadProgress }) =>
			updateMe(data, onUploadProgress),
		onSuccess: (user) => {
			queryClient.setQueryData(["user"], user);
			toast.success("Profile updated successfully!");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update profile");
		},
	});
}

export function useDeleteUserImage() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteMeImage,
		onSuccess: (user) => {
			queryClient.setQueryData(["user"], user);
			toast.success("Profile image deleted!");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete image");
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

export function useForgotPassword() {
	return useMutation({
		mutationFn: forgotPasswordApi,
		onSuccess: () => {
			toast.success("Reset code sent to your email!");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to send reset code");
		},
	});
}

export function useResetPassword() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: resetPasswordApi,
		onSuccess: (data) => {
			queryClient.setQueryData(["user"], data.data.user);
			toast.success("Password reset successfully!");
			navigate("/app/dashboard", { replace: true });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to reset password");
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
