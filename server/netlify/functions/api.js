import serverless from "serverless-http";
import { app } from "../../src/app.js";
import { connectDB } from "../../src/db/dataBase.js";

// Ensure DB connection
let isConnected = false;

const handler = async (event, context) => {
	if (!isConnected) {
		await connectDB();
		isConnected = true;
	}
	return serverless(app)(event, context);
};

export { handler };
