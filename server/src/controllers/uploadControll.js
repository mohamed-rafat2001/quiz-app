import cloudinary, { streamUpload } from "../utils/cloudinary.js";
import errorHandling from "../middelwars/errorHandling.js";
import response from "../utils/handelResponse.js";
import appError from "../utils/appError.js";

export const uploadImage = errorHandling(async (req, res, next) => {
	if (!req.file) return next(new appError("Please upload an image", 400));

	const { public_id, secure_url } = await streamUpload(
		req.file.buffer,
		`quizApp/${req.user.role}/id_${req.user._id}/uploads`
	);

	response({ public_id, secure_url }, 201, res);
});

export const deleteImage = errorHandling(async (req, res, next) => {
	const { public_id } = req.body;
	if (!public_id) return next(new appError("Please provide public_id", 400));

	await cloudinary.uploader.destroy(public_id);
	response(null, 204, res);
});
