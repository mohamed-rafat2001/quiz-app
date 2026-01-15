import { useState, useEffect } from "react";
import Login from "../../../features/auth/components/Login";
import SignUp from "../../../features/auth/components/SignUp";
import { useUser } from "../../../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

export default function Auth() {
	console.log("Auth component rendering");
	const [isLogin, setIsLogin] = useState(true);
	const { data: user, isLoading, error } = useUser();
	const navigate = useNavigate();

	console.log("Auth state:", {
		isLoading,
		hasUser: !!user,
		user: user,
		error: error,
		errorMessage: error?.message,
	});

	useEffect(() => {
		if (user) {
			navigate("/app/dashboard", { replace: true });
		}
	}, [user, navigate]);

	if (isLoading) return <Loader />;

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 py-12">
			<div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
				{/* Left Side - Hero Section */}
				<div className="hidden md:flex md:w-5/12 bg-indigo-600 p-12 text-white flex-col justify-between relative overflow-hidden">
					<div className="relative z-10">
						<div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-8 shadow-inner">
							Q
						</div>
						<h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
							Master Your <br /> Knowledge.
						</h1>
						<p className="text-indigo-100 text-lg mb-8 leading-relaxed">
							Join thousands of students and teachers in our interactive quiz
							community. Learn, compete, and grow together.
						</p>
					</div>

					<div className="relative z-10">
						<div className="flex gap-4 items-center">
							<div className="flex -space-x-3">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-400 flex items-center justify-center text-[10px] font-bold shadow-lg"
									>
										U{i}
									</div>
								))}
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-bold text-white">
									+5,000 users
								</span>
								<span className="text-xs text-indigo-200">
									Active this month
								</span>
							</div>
						</div>
					</div>

					{/* Decorative Elements */}
					<div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-50 animate-pulse" />
					<div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-30 animate-pulse" />
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-indigo-400/20 pointer-events-none" />
				</div>

				{/* Right Side - Form Section */}
				<div className="w-full md:w-7/12 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white">
					<div className="max-w-md mx-auto w-full">
						<div className="text-center mb-10">
							<div className="md:hidden mb-6 flex justify-center">
								<div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-indigo-200">
									Q
								</div>
							</div>
							<h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
								{isLogin ? "Welcome Back!" : "Create Account"}
							</h2>
							<p className="text-gray-500 font-medium">
								{isLogin
									? "Enter your credentials to access your account."
									: "Start your journey with us today."}
							</p>
						</div>

						{/* Toggle Switch */}
						<div className="bg-gray-100 p-1.5 rounded-2xl flex mb-10 relative">
							<div
								className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out ${
									isLogin ? "left-1.5" : "left-[calc(50%+3px)]"
								}`}
							/>
							<button
								className={`flex-1 py-3 text-sm font-bold relative z-10 transition-colors duration-200 cursor-pointer ${
									isLogin ? "text-indigo-600" : "text-gray-500"
								}`}
								onClick={() => setIsLogin(true)}
							>
								Login
							</button>
							<button
								className={`flex-1 py-3 text-sm font-bold relative z-10 transition-colors duration-200 cursor-pointer ${
									!isLogin ? "text-indigo-600" : "text-gray-500"
								}`}
								onClick={() => setIsLogin(false)}
							>
								Sign Up
							</button>
						</div>

						<div className="transition-all duration-300 transform">
							{isLogin ? <Login /> : <SignUp />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
