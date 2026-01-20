import { check } from "express-validator";
import validatorMiddleware from "./validatorMiddleware.js";

export const createQuizValidator = [
	check("quizName").notEmpty().withMessage("Quiz name is required"),
	check("expire")
		.notEmpty()
		.withMessage("Time limit is required")
		.isNumeric()
		.withMessage("Time limit must be a number")
		.isInt({ min: 1 })
		.withMessage("Time limit must be at least 1"),
	check("expireUnit")
		.optional()
		.isIn(["minutes", "hours"])
		.withMessage("Time limit unit must be either minutes or hours"),
	check("expireDate")
		.notEmpty()
		.withMessage("Quiz deadline is required")
		.isISO8601()
		.withMessage("Invalid deadline date format"),
	check("tries")
		.optional()
		.isNumeric()
		.withMessage("Tries must be a number")
		.isInt({ min: 1 })
		.withMessage("Tries must be at least 1"),
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
	check("id").notEmpty().withMessage("Quiz ID is required"),
	validatorMiddleware,
];
