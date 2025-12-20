import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Auth from "./ui/Auth";
import AppLayout from "./ui/AppLayout";
import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
} from "react-router-dom";
import Profile from "./components/profile/Profile";

import Home from "./pages/Home";
import Answers from "./components/quiz/Answers";
import Quizs from "./components/quiz/Quizs";
import SingleQuiz from "./components/quiz/SingleQuiz";
import QuizAnswers from "./components/quiz/QuizAnswers";
import SingleAnswer from "./components/quiz/SingleAnswer";
// import useProtect from "./Hooks/useProtect.js";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 0,
		},
	},
});
const router = createBrowserRouter([
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
				path: "/Quizs/Answers",
				element: <QuizAnswers />,
			},
		],
	},
]);
// eslint-disable-next-line react/prop-types
// function PrivateRoute({ children }) {
// 	const isAuthenticated = useProtect();
// 	return isAuthenticated ? children : <Navigate to="/home" />;
// }
function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}

export default App;
