import multer from "multer";
import appError from "./appError.js";

export default function fileUpload(validation) {
	const storage = multer.memoryStorage();
	
	const multerFilter = (req, file, cb) => {
		if (!file.mimetype.startsWith(validation)) {
			return cb(
				new appError(
					`Not an ${validation}! Please upload only ${validation}.`,
					400
				),
				false
			);
		}
		cb(null, true);
	};

	const upload = multer({
		storage: storage,
		fileFilter: multerFilter,
		limits: {
			fileSize: 5 * 1024 * 1024, // 5MB limit
		},
	});
	return upload;
}
