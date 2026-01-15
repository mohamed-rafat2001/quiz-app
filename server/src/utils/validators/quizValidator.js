import { check } from "express-validator";
import validatorMiddleware from "./validatorMiddleware.js";

export const createQuizValidator = [
	check("quizName").notEmpty().withMessage("Quiz name is required"),
	check("expire")
		.notEmpty()
		.withMessage("Expiration time is required")
		.isNumeric()
		.withMessage("Expiration time must be a number"),
	check("questions")
		.notEmpty()
		.withMessage("Questions are required")
		.isArray({ min: 1 })
		.withMessage("At least one question is required"),
	check("questions.*.ques").notEmpty().withMessage("Question text is required"),
	check("questions.*.answers")
		.isArray({ min: 2 })
		.withMessage("At least two answers are required"),
	check("questions.*.correctAnswer")
		.notEmpty()
		.withMessage("Correct answer is required"),
	check("questions.*.Score")
		.isNumeric()
		.withMessage("Question score must be a number"),
	validatorMiddleware,
];

export const getQuizValidator = [
	check("id").isMongoId().withMessage("Invalid quiz ID format"),
	validatorMiddleware,
];
