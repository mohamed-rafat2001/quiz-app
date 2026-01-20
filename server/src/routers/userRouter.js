import express from "express";
const userRouter = express.Router();
import fileUpload from "../utils/multer.js";
import {
	createUser,
	loginFunc,
	logout,
	updateMe,
	getMe,
	deleteMe,
	deleteMeImage,
	getUser,
	updatePassword,
	forgetPass,
	resetPass,
	blockUserByAdmin,
	allUsers,
	deleteUserByAdmin,
	updateUserByAdmin,
} from "../controllers/userControll.js";
import { allowTo, protect, isLoggedIn } from "../middelwars/authMiddelwar.js";
import {
	signupValidator,
	loginValidator,
} from "../utils/validators/authValidator.js";

//auth
userRouter.route("/sign-up").post(signupValidator, createUser);
userRouter.route("/login").post(loginValidator, loginFunc);
userRouter.post("/logout", logout);
userRouter.post("/forget-password", forgetPass);
userRouter.patch("/reset-password", resetPass);

// /me GET route with optional auth to avoid 401 console errors
userRouter.get("/me", isLoggedIn, getMe, getUser);

// protect all routes after this middelware
userRouter.use(protect);
userRouter
	.route("/me")
	.patch(fileUpload("image").single("image"), updateMe)
	.delete(deleteMe);
userRouter.delete("/me-image", deleteMeImage);
userRouter.patch("/update-password", updatePassword);
userRouter.get("/get-user/:id", getUser);
userRouter.patch("/block-user/admin/:id", allowTo("admin"), blockUserByAdmin);
userRouter.route("/all-users/admin").get(allowTo("admin"), allUsers).post(allowTo("admin"), createUser);
userRouter
	.route("/admin/:id")
	.patch(allowTo("admin"), updateUserByAdmin)
	.delete(allowTo("admin"), deleteUserByAdmin);
export default userRouter;
