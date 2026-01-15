import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Auth from "../shared/components/ui/Auth";
import AppLayout from "../shared/components/ui/AppLayout";
import Profile from "../features/profile/components/Profile";
import Home from "../pages/Home";
import Answers from "../features/quiz/components/Answers";
import Quizs from "../features/quiz/components/Quizs";
import SingleQuiz from "../features/quiz/components/SingleQuiz";
import QuizAnswers from "../features/quiz/components/QuizAnswers";
import SingleAnswer from "../features/quiz/components/SingleAnswer";
import CreateQuiz from "../features/quiz/components/CreateQuiz";
import DashBoard from "../features/dashboard/components/DashBoard";
import AdminUsers from "../features/admin/components/AdminUsers";
import AdminQuizzes from "../features/admin/components/AdminQuizzes";
import Landing from "../pages/Landing";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Landing />,
	},
	{
		path: "/welcome",
		element: <Auth />,
	},
	{
		path: "/app",
		element: <AppLayout />,
		children: [
			{
				index: true,
				element: <Navigate to="/app/dashboard" replace />,
			},
			{
				path: "dashboard",
				element: <DashBoard />,
			},
			{
				path: "home",
				element: <Home />,
			},
			{
				path: "admin/users",
				element: <AdminUsers />,
			},
			{
				path: "admin/quizzes",
				element: <AdminQuizzes />,
			},
			{
				path: "profile",
				element: <Profile />,
			},
			{
				path: "QuizAnswers",
				element: <Answers />,
			},
			{
				path: "QuizAnswers/:id",
				element: <SingleAnswer />,
			},
			{
				path: "Quizs",
				element: <Quizs />,
			},
			{
				path: "singleQuiz/:id",
				element: <SingleQuiz />,
			},
			{
				path: "Quizs/Answers/:id",
				element: <QuizAnswers />,
			},
			{
				path: "Quizs/Create",
				element: <CreateQuiz />,
			},
			{
				path: "Quizs/Edit/:id",
				element: <CreateQuiz />,
			},
		],
	},
]);
