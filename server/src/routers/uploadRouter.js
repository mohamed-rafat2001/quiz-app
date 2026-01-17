import express from "express";
import { uploadImage, deleteImage } from "../controllers/uploadControll.js";
import { protect } from "../middelwars/authMiddelwar.js";
import fileUpload from "../utils/multer.js";

const uploadRouter = express.Router();

uploadRouter.use(protect);

uploadRouter.post(
	"/image",
	fileUpload("image").single("image"),
	uploadImage
);

uploadRouter.delete("/image", deleteImage);

export default uploadRouter;
