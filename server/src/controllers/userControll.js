import UserModel from "../models/userModel.js";
import errorHandling from "../middelwars/errorHandling.js";
import appError from "../utils/appError.js";
import cloudinary, { streamUpload } from "../utils/cloudinary.js";
import Email from "../utils/Email.js";
import response from "../utils/handelResponse.js";
import * as factory from "../utils/handlerFactory.js";
import ApiFeatures from "../utils/apiFeatures.js";

// generate cookies
const getCookieOptions = (isLogout = false) => {
	const options = {
		expires: isLogout
			? new Date(0) // Expire immediately
			: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
		httpOnly: true,
		path: "/",
	};

	// For cross-site cookies in production (Netlify)
	if (process.env.NODE_ENV === "production") {
		options.secure = true;
		options.sameSite = "none";
	}

	return options;
};

const cookies = (token, res) => {
	res.cookie("jwt", token, getCookieOptions());
};
// create new user func
export const createUser = errorHandling(async (req, res, next) => {
	const {
		name,
		email,
		password,
		confirmPass,
		role,
		city,
		country,
		phoneNumber,
		gender,
	} = req.body;

	// Check if the current user is an admin making a request to create a user
	const isAdminCreating = req.user && req.user.role === "admin";

	// validate role and prevent admin signups if not created by an admin
	if (!isAdminCreating && role && role === "admin")
		return next(new appError("role must be student or teacher", 400));

	const findUser = await UserModel.findOne({ email });
	if (findUser) return next(new appError("email already exists", 400));

	const findName = await UserModel.findOne({ name });
	if (findName) return next(new appError("name already exists", 400));

	const user = await UserModel.create({
		name,
		email,
		password,
		confirmPass,
		role: isAdminCreating ? role : (role === "teacher" ? "teacher" : "student"),
		city,
		country,
		phoneNumber,
		gender,
	});

	// Only generate token and set cookie if not created by an admin
	if (!isAdminCreating) {
		const token = user.createToken();
		cookies(token, res);
		// await new Email(user).sendWelcome();
		response({ user, token }, 201, res);
	} else {
		// If admin is creating, just return the user data
		response({ user }, 201, res);
	}
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
	cookies(token, res);
	//send response
	response({ user, token }, 200, res);
});

// logout func
export const logout = (req, res) => {
	// 1) Clear cookie by setting it to a past date
	res.cookie("jwt", "loggedout", getCookieOptions(true));

	// 2) Also use clearCookie for good measure
	res.clearCookie("jwt", getCookieOptions(true));

	res.status(200).json({ status: "success" });
};

// filter func
const filterObj = (obj, ...data) => {
	const newObj = {};
	Object.keys(obj).forEach((ele) => {
		if (data.includes(ele) && obj[ele] !== undefined && obj[ele] !== null) {
			newObj[ele] = obj[ele];
		}
	});
	// Special handling for nested data from FormData if needed
	// But usually req.body is already flattened or contains strings
	return newObj;
};
// update me
export const updateMe = errorHandling(async (req, res, next) => {
	const updates = filterObj(
		req.body,
		"name",
		"email",
		"city",
		"country",
		"phoneNumber",
		"gender"
	);

	// Check if the new name or email already exists (excluding current user)
	if (updates.email) {
		const existingEmail = await UserModel.findOne({
			email: updates.email,
			_id: { $ne: req.user._id },
		});
		if (existingEmail) return next(new appError("email already exists", 400));
	}

	if (updates.name) {
		const existingName = await UserModel.findOne({
			name: updates.name,
			_id: { $ne: req.user._id },
		});
		if (existingName) return next(new appError("name already exists", 400));
	}

	if (req.file) {
		// delete old image from cloudinary if exists
		const userBeforeUpdate = await UserModel.findById(req.user._id);
		if (userBeforeUpdate?.profileImg?.public_id) {
			await cloudinary.uploader.destroy(userBeforeUpdate.profileImg.public_id);
		}

		// upload img in cloudinary
		const { public_id, secure_url } = await streamUpload(
			req.file.buffer,
			`quizApp/user/id_${req.user._id}/profileImg`
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

// delete me image
export const deleteMeImage = errorHandling(async (req, res, next) => {
	const user = await UserModel.findById(req.user._id);
	if (user?.profileImg?.public_id) {
		await cloudinary.uploader.destroy(user.profileImg.public_id);
	}

	user.profileImg = undefined;
	await user.save({ validateBeforeSave: false });

	response(user, 200, res);
});

// get Me
export const getMe = errorHandling(async (req, res, next) => {
	if (!req.user) {
		return res.status(200).json({
			status: "success",
			data: null,
		});
	}
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
export const allUsers = errorHandling(async (req, res, next) => {
	const filter = { role: { $ne: "admin" } };

	// Create features instance
	const features = new ApiFeatures(UserModel.find(filter), req.query)
		.filter()
		.sort()
		.limitFields();

	// Get total count for pagination (cloning the query)
	const total = await features.query.clone().countDocuments();

	// Get stats for all users (not just current page)
	const stats = await UserModel.aggregate([
		{ $match: filter },
		{
			$group: {
				_id: null,
				totalStudents: {
					$sum: { $cond: [{ $eq: ["$role", "student"] }, 1, 0] },
				},
				totalTeachers: {
					$sum: { $cond: [{ $eq: ["$role", "teacher"] }, 1, 0] },
				},
				activeUsers: {
					$sum: { $cond: [{ $eq: ["$active", true] }, 1, 0] },
				},
				blockedUsers: {
					$sum: {
						$cond: [
							{
								$or: [
									{ $eq: ["$active", false] },
									{ $eq: ["$block", true] },
								],
							},
							1,
							0,
						],
					},
				},
			},
		},
	]);

	// Apply pagination
	features.paginate();
	const users = await features.query;

	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 10;

	response(
		{
			docs: users,
			total,
			stats: stats[0] || {
				totalStudents: 0,
				totalTeachers: 0,
				activeUsers: 0,
				blockedUsers: 0,
			},
		},
		200,
		res,
		{ total, page, limit }
	);
});
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
	const { email } = req.body;
	if (!email) return next(new appError("please enter your email", 400));

	// 1) find user
	const user = await UserModel.findOne({ email });
	if (!user) return next(new appError("user not found", 404));

	// 2) generate reset code
	const resetCode = user.createPasswordResetCode();
	await user.save({ validateBeforeSave: false });

	// 3) send email
	try {
		await new Email(user).sendPasswordReset(resetCode);
		response({ message: "Reset code sent to your email" }, 200, res);
	} catch (err) {
		user.passwordResetCode = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });
		return next(
			new appError(
				"There was an error sending the email. Try again later!",
				500
			)
		);
	}
});

// reset password
export const resetPass = errorHandling(async (req, res, next) => {
	const { resetPassCode, newPassword, confirmPass } = req.body;
	if (!resetPassCode) return next(new appError("please enter the code", 400));

	// 1) get user based on reset code and check if it has not expired
	const user = await UserModel.findOne({
		passwordResetCode: resetPassCode,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!user) return next(new appError("Code is invalid or has expired", 400));

	// 2) update password
	if (!confirmPass || !newPassword)
		return next(new appError("please enter valid password", 400));

	user.password = newPassword;
	user.confirmPass = confirmPass;
	user.passwordResetCode = undefined;
	user.passwordResetExpires = undefined;

	// 3) save user and generate token
	await user.save();

	const token = user.createToken();
	if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;
	cookies(token, res);

	response({ user, token }, 200, res);
});
