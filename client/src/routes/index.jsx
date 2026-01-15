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

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Auth />,
	},
	{
		element: <AppLayout />,
		children: [
			{
				path: "/home",
				element: <Home />,
			},
			{
				path: "/profile",
				element: <Profile />,
			},
			{
				path: "/QuizsAsnwers",
				element: <Answers />,
			},
			{
				path: "/QuizsAsnwers/:id",
				element: <SingleAnswer />,
			},
			{
				path: "/Quizs",
				element: <Quizs />,
			},
			{
				path: "/singleQuiz/:id",
				element: <SingleQuiz />,
			},
			{
				path: "/Quizs/Answers/:id",
				element: <QuizAnswers />,
			},
		],
	},
]);
