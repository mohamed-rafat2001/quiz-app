import serverless from "serverless-http";
import { app } from "../../src/app.js";
import { connectDB } from "../../src/db/dataBase.js";

// Ensure DB connection
let isConnected = false;

const handler = async (event, context) => {
	try {
		if (!isConnected) {
			await connectDB();
			isConnected = true;
		}
		
		return await serverless(app)(event, context);
	} catch (error) {
		console.error("Netlify Function Error:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				status: "error",
				message: "Internal Server Error",
				details: error.message
			})
		};
	}
};

export { handler };
