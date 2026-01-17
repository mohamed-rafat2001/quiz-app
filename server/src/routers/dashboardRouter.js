import express from "express";
const dashboardRouter = express.Router();
import { protect, allowTo } from "../middelwars/authMiddelwar.js";
import {
	getStats,
	getTeacherQuizStats,
} from "../controllers/dashboardControll.js";

dashboardRouter.use(protect);
dashboardRouter.get("/stats", getStats);
dashboardRouter.get(
	"/teacher-quizzes",
	allowTo("teacher"),
	getTeacherQuizStats
);

export default dashboardRouter;
