import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().min(1, "Email is required").email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z
			.string()
			.min(1, "Email is required")
			.email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPass: z.string().min(1, "Please confirm your password"),
		role: z.enum(["student", "teacher"], {
			required_error: "Please select a role",
		}),
	})
	.refine((data) => data.password === data.confirmPass, {
		message: "Passwords don't match",
		path: ["confirmPass"],
	});

export const updateMeSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export const updatePasswordSchema = z
	.object({
		password: z.string().min(6, "Current password is required"),
		newPassword: z
			.string()
			.min(6, "New password must be at least 6 characters"),
		confirmPass: z.string().min(1, "Please confirm your new password"),
	})
	.refine((data) => data.newPassword === data.confirmPass, {
		message: "Passwords don't match",
		path: ["confirmPass"],
	});

export const startQuizSchema = z.object({
	quizId: z.string().min(1, "Quiz ID is required"),
	quizPassword: z.string().min(1, "Quiz password is required"),
});

export const createQuizSchema = z.object({
	quizName: z.string().min(3, "Quiz name must be at least 3 characters"),
	expire: z
		.number()
		.min(1, "Expire days must be at least 1")
		.max(30, "Maximum 30 days"),
	questions: z
		.array(
			z.object({
				ques: z.string().min(5, "Question must be at least 5 characters"),
				answers: z
					.array(z.string().min(1, "Answer cannot be empty"))
					.min(2, "At least 2 answers required"),
				correctAnswer: z.string().min(1, "Please select the correct answer"),
				Score: z.number().min(1, "Score must be at least 1"),
			})
		)
		.min(1, "At least one question is required"),
});

export const submitQuizSchema = z.object({
	answer: z.array(
		z
			.string({ required_error: "Please select an answer" })
			.min(1, "Please select an answer")
	),
});
