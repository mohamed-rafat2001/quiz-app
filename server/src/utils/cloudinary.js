import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
	cloud_name: process.env.cloud_name,
	api_key: process.env.api_key,
	api_secret: process.env.api_secret,
	secure: process.env.secure,
});

export const streamUpload = (buffer, folder) => {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{ folder: folder },
			(error, result) => {
				if (result) {
					resolve(result);
				} else {
					reject(error);
				}
			}
		);
		stream.end(buffer);
	});
};

export default cloudinary;
