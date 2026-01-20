import mongoose from "mongoose";

export const connectDB = async () => {
	const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;
	const isDev = process.env.NODE_ENV === "development";

	if (!dbUrl && !isDev) {
		const errorMsg = "DB_URL is not defined in production environment!";
		console.error(errorMsg);
		process.exit(1);
	}

	try {
		let finalUrl = dbUrl || "mongodb://127.0.0.1:27017/quiz-app";

		if (process.env.DB_PASSWORD && finalUrl.includes("<db_password>")) {
			finalUrl = finalUrl.replace("<db_password>", process.env.DB_PASSWORD);
		}

		mongoose.set("strictQuery", false);
		await mongoose.connect(finalUrl);
		console.log("MongoDB Connected successfully");
	} catch (error) {
		console.error(`Error connecting to MongoDB: ${error.message}`);

		// In serverless, we don't want to process.exit(1) as it kills the instance
		// Instead, we throw the error so the function handler can catch it or Netlify can log it
		throw error;
	}
};
