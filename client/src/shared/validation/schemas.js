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
		city: z.string().min(2, "City is required"),
		country: z.string().min(2, "Country is required"),
		phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
		gender: z.enum(["male", "female"], {
			required_error: "Please select your gender",
		}),
	})
	.refine((data) => data.password === data.confirmPass, {
		message: "Passwords don't match",
		path: ["confirmPass"],
	});

export const forgotPasswordSchema = z.object({
	email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export const resetPasswordSchema = z
	.object({
		resetPassCode: z.string().min(6, "Code must be at least 6 characters"),
		newPassword: z.string().min(6, "Password must be at least 6 characters"),
		confirmPass: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.newPassword === data.confirmPass, {
		message: "Passwords don't match",
		path: ["confirmPass"],
	});

export const updateMeSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().min(1, "Email is required").email("Invalid email address"),
	city: z.string().min(2, "City is required"),
	country: z.string().min(2, "Country is required"),
	phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
	gender: z.enum(["male", "female"], {
		required_error: "Please select your gender",
	}),
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
	expire: z.number().min(1, "Time limit must be at least 1"),
	expireUnit: z.enum(["minutes", "hours"]).default("minutes"),
	expireDate: z.string().min(1, "Quiz deadline is required"),
	tries: z
		.number()
		.min(1, "Attempts must be at least 1")
		.max(10, "Maximum 10 attempts allowed")
		.default(1),
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
