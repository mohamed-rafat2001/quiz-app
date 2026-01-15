import { check } from "express-validator";
import validatorMiddleware from "./validatorMiddleware.js";

export const signupValidator = [
	check("name")
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ min: 3 })
		.withMessage("Name must be at least 3 characters long"),
	check("email")
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Invalid email address"),
	check("password")
		.notEmpty()
		.withMessage("Password is required")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
	check("confirmPass")
		.notEmpty()
		.withMessage("Confirm password is required")
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error("Passwords do not match");
			}
			return true;
		}),
	validatorMiddleware,
];

export const loginValidator = [
	check("email")
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Invalid email address"),
	check("password").notEmpty().withMessage("Password is required"),
	validatorMiddleware,
];
