import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "name required"],
			
			trim: true,
			minlength: 3,
		},
		username: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
		},
		city: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
		},
		country: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
		},
		phoneNumber: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			required: [true, "email required"],
			unique: true,
			trim: true,
			validate: [validator.isEmail, "please enter the correct email"],
		},
		password: {
			type: String,
			required: [true, "password required"],
			trim: true,
			validate: [
				validator.isStrongPassword,
				"password must be minlength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 ",
			],
		},
		confirmPass: {
			type: String,
			required: [true, "confirmPass required"],
			trim: true,
			validate: {
				validator: function (el) {
					return el === this.password;
				},
				message: "confirm password must equal password",
			},
		},

		role: {
			type: String,
			default: "admin",
			enum: ["student", "teacher", "admin"],
		},
		active: {
			type: Boolean,
			default: true,
		},
		block: {
			type: Boolean,
			default: false,
		},
		profileImg: {
			public_id: String,
			secure_url: String,
		},
		gender: {
			type: String,
			enum: ["male", "female"],
			required: true,
		},
		passwordResetCode: String,
		passwordResetExpires: Date,
	},
	{ timestamps: true }
);
userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcryptjs.hash(this.password, 12);
		this.confirmPass = undefined;
	}

	if (this.isNew && !this.username) {
		const baseUsername = this.name.toLowerCase().replace(/\s+/g, "");

		let uniqueUsername = baseUsername;
		let isUnique = false;
		let attempts = 0;

		while (!isUnique && attempts < 10) {
			const existingUser = await mongoose.model("UserModel").findOne({
				username: uniqueUsername,
			});
			if (!existingUser) {
				isUnique = true;
			} else {
				// Append random digits if collision occurs
				const randomSuffix = Math.floor(1000 + Math.random() * 9000);
				uniqueUsername = `${baseUsername}${randomSuffix}`;
				attempts++;
			}
		}
		this.username = uniqueUsername;
	}
	next();
});
// create passwordResetToken
userSchema.methods.createPasswordResetCode = function () {
	const buffer = crypto.randomBytes(6);
	let code = "";

	for (let i = 0; i < 6; i++) {
		code += (buffer[i] % 10).toString();
	}
	this.passwordResetCode = code;
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return code;
};
userSchema.pre(/^find/, function (next) {
	this.find({
		active: {
			$ne: false,
		},
	});
	this.find({
		block: {
			$ne: true,
		},
	});
	next();
});
userSchema.methods.createToken = function () {
	const token = jwt.sign({ id: this._id.toString() }, process.env.JWT_SECRET);
	return token;
};
userSchema.methods.correctPassword = async function (password, userPassword) {
	const checkPass = await bcryptjs.compare(password, userPassword);
	return checkPass;
};
userSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password;
	delete user.__v;
	return user;
};
const UserModel = mongoose.model("UserModel", userSchema);
export default UserModel;
