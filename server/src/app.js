import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/dataBase.js";

import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";
dotenv.config();
export const app = express();
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	res.on("finish", () => {
		console.log(`Response: ${res.statusCode}`);
	});
	next();
});
// share api with frontEnd
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const sanitizedClientUrl = clientUrl.endsWith("/") ? clientUrl.slice(0, -1) : clientUrl;

app.use(
	cors({
		origin: sanitizedClientUrl,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
// set security HTTP headers
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: ["'self'", "'unsafe-inline'"],
				styleSrc: ["'self'", "'unsafe-inline'"],
				imgSrc: ["'self'", "data:", "res.cloudinary.com"],
				connectSrc: ["'self'", "res.cloudinary.com"],
			},
		},
	})
);

// limit requests
const limiter = rateLimit({
	max: 1000,
	windowMs: 60 * 60 * 1000,
	message: "many requests for this IP, please try again after one hour",
});
app.use("/api/v1", limiter);
// body parser , reading data from body into req.body
app.use(express.json());
app.use(cookieParser());

// data sanitize against NoSql query injection
app.use(mongoSanitize());
//data sanitize against XSS
app.use(xss());
// prevent parameter pollution
app.use(hpp());

// Routers

import userRouter from "./routers/userRouter.js";
import quizRouter from "./routers/quizRouter.js";
import quizAnswerRouter from "./routers/quizAnswerRouter.js";
import dashboardRouter from "./routers/dashboardRouter.js";
import uploadRouter from "./routers/uploadRouter.js";
app.use("/api/v1/user", userRouter);
app.use("/api/v1/teacher", quizRouter);
app.use("/api/v1/answer", quizAnswerRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/upload", uploadRouter);

// handling routes not found in app
app.all("*", (req, res, next) => {
	res.status(404).json({
		status: "fail",
		message: `this route: ${req.originalUrl} not found in app`,
	});
});

// global error
import globalError from "./controllers/errorControll.js";

app.use(globalError);
