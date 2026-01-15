import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPass: z.string().min(1, "Please confirm your password"),
  role: z.enum(["student", "teacher"], {
    required_error: "Please select a role",
  }),
}).refine((data) => data.password === data.confirmPass, {
  message: "Passwords don't match",
  path: ["confirmPass"],
});

export const updateMeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPass: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPass, {
  message: "Passwords don't match",
  path: ["confirmPass"],
});

export const startQuizSchema = z.object({
  quizId: z.string().min(1, "Quiz ID is required"),
  quizPassword: z.string().min(1, "Quiz password is required"),
});
