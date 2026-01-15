import express from "express";
const dashboardRouter = express.Router();
import { protect } from "../middelwars/authMiddelwar.js";
import { getStats } from "../controllers/dashboardControll.js";

dashboardRouter.use(protect);
dashboardRouter.get("/stats", getStats);

export default dashboardRouter;
