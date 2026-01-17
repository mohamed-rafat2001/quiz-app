import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Loader from "../shared/components/ui/Loader";

// Lazy load components
const Auth = lazy(() => import("../shared/components/ui/Auth"));
const AppLayout = lazy(() => import("../shared/components/ui/AppLayout"));
const Profile = lazy(() => import("../features/profile/components/Profile"));
const Home = lazy(() => import("../pages/Home"));
const Answers = lazy(() => import("../features/quiz/components/Answers"));
const Quizs = lazy(() => import("../features/quiz/components/Quizs"));
const SingleQuiz = lazy(() => import("../features/quiz/components/SingleQuiz"));
const QuizAnswers = lazy(() =>
	import("../features/quiz/components/QuizAnswers")
);
const SingleAnswer = lazy(() =>
	import("../features/quiz/components/SingleAnswer")
);
const CreateQuiz = lazy(() => import("../features/quiz/components/CreateQuiz"));
const DashBoard = lazy(() =>
	import("../features/dashboard/components/DashBoard")
);
const AdminUsers = lazy(() =>
	import("../features/admin/components/AdminUsers")
);
const AdminQuizzes = lazy(() =>
	import("../features/admin/components/AdminQuizzes")
);
const Landing = lazy(() => import("../pages/Landing"));
const NotFound = lazy(() => import("../shared/components/ui/NotFound"));
const ErrorElement = lazy(() =>
	import("../shared/components/ui/NotFound").then((module) => ({
		default: module.ErrorElement,
	}))
);

const SuspenseLayout = ({ children }) => (
	<Suspense fallback={<Loader />}>{children}</Suspense>
);

export const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<SuspenseLayout>
				<Landing />
			</SuspenseLayout>
		),
		errorElement: (
			<SuspenseLayout>
				<ErrorElement />
			</SuspenseLayout>
		),
	},
	{
		path: "/welcome",
		element: (
			<SuspenseLayout>
				<Auth />
			</SuspenseLayout>
		),
		errorElement: (
			<SuspenseLayout>
				<ErrorElement />
			</SuspenseLayout>
		),
	},
	{
		path: "/app",
		element: (
			<SuspenseLayout>
				<AppLayout />
			</SuspenseLayout>
		),
		errorElement: (
			<SuspenseLayout>
				<ErrorElement />
			</SuspenseLayout>
		),
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
				path: "users/:id",
				element: <Profile />,
			},
			{
				path: "my-submissions",
				element: <Answers />,
			},
			{
				path: "my-submissions/:id",
				element: <SingleAnswer />,
			},
			{
				path: "quizzes",
				element: <Quizs />,
			},
			{
				path: "quizzes/:id",
				element: <SingleQuiz />,
			},
			{
				path: "quizzes/submissions/:id",
				element: <QuizAnswers />,
			},
			{
				path: "quizzes/create",
				element: <CreateQuiz />,
			},
			{
				path: "quizzes/edit/:id",
				element: <CreateQuiz />,
			},
		],
	},
	{
		path: "*",
		element: (
			<SuspenseLayout>
				<NotFound />
			</SuspenseLayout>
		),
	},
]);
