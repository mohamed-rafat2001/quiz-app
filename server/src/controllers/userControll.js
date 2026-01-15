import UserModel from "../models/userModel.js";
import errorHandling from "../middelwars/errorHandling.js";
import appError from "../utils/appError.js";
import cloudinary from "../utils/cloudinary.js";
import Email from "../utils/Email.js";
import response from "../utils/handelResponse.js";
import * as factory from "../utils/handlerFactory.js";
import uniqid from "uniqid";

// generate cookies
const cookiesOptions = {
	expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
	httpOnly: true,
};
const cookies = (token, res) => {
	res.cookie("jwt", token, cookiesOptions);
};
// create new user func
export const createUser = errorHandling(async (req, res, next) => {
	const { name, email, password, confirmPass, role } = req.body;
	if (role === "admin")
		return next(new appError("role must be student or teacher", 400));
	const findUser = await UserModel.findOne({ email });
	if (findUser) return next(new appError("email already esist", 400));
	const user = await UserModel.create({
		name,
		email,
		password,
		confirmPass,
		role,
	});
	const token = user.createToken();
	if (process.env.STATUS === "PRODUCTION") cookiesOptions.secure = true;
	cookies(token, res);
	// await new Email(user).sendWelcome();

	response({ user, token }, 201, res);
});
// login func
export const loginFunc = errorHandling(async (req, res, next) => {
	const { email, password } = req.body;
	// ckeck if email and password is exist
	if (!email || !password)
		return next(new appError("please provide email and password", 400));

	// find user by email and check if password is correct
	const user = await UserModel.findOne({ email });
	if (!user || !(await user.correctPassword(password, user.password)))
		return next(new appError("email or password is wrong", 401));

	//create token
	const token = user.createToken();
	// send cookie
	if (process.env.STATUS === "PRODUCTION") cookiesOptions.secure = true;
	cookies(token, res);
	//send response
	response({ user, token }, 200, res);
});

// logout func
export const logout = (req, res) => {
	res.cookie("jwt", "loggedout", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});
	res.status(200).json({ status: "success" });
};

// filter func
const filterObj = (obj, ...data) => {
	const newObj = {};
	Object.keys(obj).forEach((ele) => {
		if (data.includes(ele)) newObj[ele] = obj[ele];
	});
	return newObj;
};
// update me
export const updateMe = errorHandling(async (req, res, next) => {
	const updates = filterObj(req.body, "name", "email");
	if (req.file) {
		// upload img in cloudinary
		const { public_id, secure_url } = await cloudinary.uploader.upload(
			req.file.path,
			{ folder: `quizApp/user/id_${req.user._id}/profileImg` }
		);
		updates.profileImg = { public_id, secure_url };
	}
	const user = await UserModel.findByIdAndUpdate(req.user._id, updates, {
		new: true,
		runValidators: true,
	});
	if (!user) return next(new appError("user not updated", 400));
	response(user, 200, res);
});

// get Me
export const getMe = errorHandling(async (req, res, next) => {
	req.params.id = req.user._id;
	next();
});
// get user
export const getUser = factory.getOne(UserModel);

//delete me
export const deleteMe = errorHandling(async (req, res, next) => {
	await UserModel.findByIdAndUpdate(req.user._id, { active: false });

	response(null, 200, res);
});

//admin get all users
export const allUsers = factory.getAll(UserModel, { role: { $ne: "admin" } });
// admin block user
export const blockUserByAdmin = factory.updateOne(UserModel);
// admin delete user
export const deleteUserByAdmin = factory.deleteOne(UserModel);
// admin update user (for role etc)
export const updateUserByAdmin = factory.updateOne(UserModel);
// update password
export const updatePassword = errorHandling(async (req, res, next) => {
	// find user
	const user = await UserModel.findById(req.user._id);
	if (!user) return next(new appError("user not found", 404));
	// check in body
	const { password, newPassword, confirmPass } = req.body;
	if (!password || !confirmPass || !newPassword)
		return next(new appError("please enter valid password", 400));

	// if password from body match with user password
	const checkPass = await user.correctPassword(password, user.password);
	if (!checkPass) return next(new appError("password is wrong", 401));

	//update password and confirm password
	user.password = newPassword;
	user.confirmPass = confirmPass;
	await user.save();

	// send response
	response(user, 200, res);
});
//forget password
export const forgetPass = errorHandling(async (req, res, next) => {
	const email = req.body.email;
	const resetPassCode = uniqid();
	if (!email) return next(new appError("please enter your email", "400"));
	// find user
	let user = await UserModel.findOne({ email });
	if (!user) return next(new appError("user not founded", 404));
	await new Email(user).resetPass(
		`hi ${user.name} copy this code: ${resetPassCode} and paste in reset password page `
	);
	user = await UserModel.findByIdAndUpdate(
		user._id,
		{ resetPassCode },
		{ new: true, runValidators: true }
	);
	response(null, 200, res);
});
// reset password
export const resetPass = errorHandling(async (req, res, next) => {
	const { resetPassCode, newPassword, confirmPass } = req.body;
	if (!resetPassCode) return next(new appError("please enter the code", 400));
	const user = await UserModel.findOne({ resetPassCode });
	if (!user) return next(new appError("code is wrong", 401));
	if (!confirmPass || !newPassword)
		return next(new appError("please enter valid password", 400));

	//update password and confirm password
	user.password = newPassword;
	user.confirmPass = confirmPass;
	user.resetPassCode = "";
	// generat token and cookies
	const token = user.createToken();
	if (process.env.STATUS === "PRODUCTION") cookiesOptions.secure = true;
	cookies(token, res);
	// save doc
	await user.save();

	// send response
	response({ user, token }, 200, res);
});
