import mongoose from "mongoose";
export default function dbConnect() {
	mongoose
		.connect(process.env.DB_URL)
		.then(() => {
			console.log("DB connected successfully");
		})
		.catch((e) => {
			console.log("DB connection error:", e.message);
		});
}
