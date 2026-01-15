import { check } from "express-validator";
import validatorMiddleware from "./validatorMiddleware.js";

export const quizAnswerValidator = [
	check("id").isMongoId().withMessage("Invalid quiz ID format"),
	check("questions")
		.notEmpty()
		.withMessage("Questions answers are required")
		.isArray({ min: 1 })
		.withMessage("At least one question answer is required"),
	check("questions.*._id").notEmpty().withMessage("Question ID is required"),
	check("questions.*.answer")
		.notEmpty()
		.withMessage("Student answer is required"),
	validatorMiddleware,
];
