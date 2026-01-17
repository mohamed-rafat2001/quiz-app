import { useState, useEffect } from "react";
import Login from "../../../features/auth/components/Login";
import SignUp from "../../../features/auth/components/SignUp";
import { useUser } from "../../../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

export default function Auth() {
	const [isLogin, setIsLogin] = useState(true);
	const { data: user, isLoading } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate("/app/dashboard", { replace: true });
		}
	}, [user, navigate]);

	if (isLoading) return <Loader />;

	return (
		<div className="min-h-screen bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4 py-12 transition-colors duration-300">
			<div className="w-full max-w-5xl bg-white dark:bg-white/[0.03] rounded-[2.5rem] shadow-2xl shadow-black/20 overflow-hidden flex flex-col md:flex-row min-h-[650px] transition-colors duration-300 border border-white/10 dark:border-white/5 backdrop-blur-xl">
				{/* Left Side - Hero Section */}
				<div className="hidden md:flex md:w-5/12 bg-indigo-600 p-16 text-white flex-col justify-between relative overflow-hidden">
					<div className="relative z-10">
						<div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white font-black text-3xl mb-10 shadow-inner">
							Q
						</div>
						<h1 className="text-4xl lg:text-5xl font-black mb-8 leading-[1.1] tracking-tighter">
							Master Your <br /> Knowledge.
						</h1>
						<p className="text-indigo-100/80 text-lg mb-8 leading-relaxed font-medium">
							Join thousands of students and teachers in our interactive quiz
							community. Learn, compete, and grow together.
						</p>
					</div>

					<div className="relative z-10">
						<div className="flex gap-4 items-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
							<div className="flex -space-x-3">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-400 flex items-center justify-center text-[10px] font-black shadow-lg"
									>
										U{i}
									</div>
								))}
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-black text-white">
									+5,000 users
								</span>
								<span className="text-xs text-indigo-200 font-bold">
									Active this month
								</span>
							</div>
						</div>
					</div>

					{/* Decorative Elements */}
					<div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-50 animate-pulse" />
					<div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-30 animate-pulse" />
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-tr from-indigo-400/20 pointer-events-none" />
				</div>

				{/* Right Side - Form Section */}
				<div className="w-full md:w-7/12 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white dark:bg-transparent transition-colors duration-300">
					<div className="max-w-md mx-auto w-full">
						<div className="text-center mb-12">
							<div className="md:hidden mb-8 flex justify-center">
								<div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-indigo-500/30">
									Q
								</div>
							</div>
							<h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
								{isLogin ? "Welcome Back!" : "Create Account"}
							</h2>
							<p className="text-gray-500 dark:text-gray-400 font-black text-sm uppercase tracking-widest">
								{isLogin
									? "Enter your credentials"
									: "Start your journey today"}
							</p>
						</div>

						{/* Toggle Switch */}
						<div className="bg-gray-100 dark:bg-white/[0.05] p-1.5 rounded-2xl flex mb-12 relative border border-gray-200/50 dark:border-white/5">
							<div
								className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-white/[0.08] rounded-xl shadow-xl transition-all duration-500 ease-out ${
									isLogin ? "left-1.5" : "left-[calc(50%+3px)]"
								}`}
							/>
							<button
								className={`flex-1 py-3.5 text-sm font-black relative z-10 transition-colors duration-300 cursor-pointer ${
									isLogin
										? "text-indigo-600 dark:text-white"
										: "text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
								}`}
								onClick={() => setIsLogin(true)}
							>
								Sign In
							</button>
							<button
								className={`flex-1 py-3.5 text-sm font-black relative z-10 transition-colors duration-300 cursor-pointer ${
									!isLogin
										? "text-indigo-600 dark:text-white"
										: "text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
								}`}
								onClick={() => setIsLogin(false)}
							>
								Register
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
