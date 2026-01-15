import { useState, useEffect } from "react";
import Login from "../../../features/auth/components/Login";
import SignUp from "../../../features/auth/components/SignUp";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Auth() {
	const [isLogin, setIsLogin] = useState(true);
	const { data: user, isLoading } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate("/home", { replace: true });
		}
	}, [user, navigate]);

	if (isLoading) return null; // Or a simple spinner

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4 sm:p-6 lg:p-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="w-full max-w-5xl bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] md:min-h-[600px]"
			>
				{/* Left Side - Hero Section */}
				<div className="hidden md:flex md:w-5/12 bg-indigo-600 p-12 text-white flex-col justify-center relative overflow-hidden">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
						className="relative z-10"
					>
						<h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
							Master Your <br /> Knowledge.
						</h1>
						<p className="text-indigo-100 text-lg mb-8 leading-relaxed">
							Join thousands of students and teachers in our interactive quiz
							community.
						</p>

						<div className="flex gap-4 items-center">
							<div className="flex -space-x-2">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-400 flex items-center justify-center text-xs font-bold"
									>
										U{i}
									</div>
								))}
							</div>
							<span className="text-sm font-medium text-indigo-100">
								+5k active users
							</span>
						</div>
					</motion.div>

					{/* Decorative Elements */}
					<div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50" />
					<div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-30" />
				</div>

				{/* Right Side - Form Section */}
				<div className="w-full md:w-7/12 p-6 sm:p-10 md:p-16 flex flex-col justify-center bg-gray-50/50">
					<div className="max-w-md mx-auto w-full">
						<div className="text-center mb-8 md:mb-10">
							<div className="md:hidden mb-6 flex justify-center">
								<div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
									Q
								</div>
							</div>
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
								{isLogin ? "Welcome Back!" : "Create Account"}
							</h2>
							<p className="text-sm sm:text-base text-gray-500">
								{isLogin
									? "Please enter your details to sign in."
									: "Fill in the information below to get started."}
							</p>
						</div>

						{/* Toggle Switch */}
						<div className="bg-gray-100 p-1 rounded-2xl flex mb-8 md:mb-10 relative">
							<motion.div
								className="absolute inset-y-1 bg-white rounded-xl shadow-sm z-0"
								initial={false}
								animate={{
									x: isLogin ? 0 : "100%",
									width: "50%",
								}}
								transition={{ type: "spring", stiffness: 300, damping: 30 }}
							/>
							<button
								className={`flex-1 py-3 text-sm font-bold rounded-xl relative z-10 transition-colors duration-200 ${
									isLogin ? "text-indigo-600" : "text-gray-500"
								}`}
								onClick={() => setIsLogin(true)}
							>
								Login
							</button>
							<button
								className={`flex-1 py-3 text-sm font-bold rounded-xl relative z-10 transition-colors duration-200 ${
									!isLogin ? "text-indigo-600" : "text-gray-500"
								}`}
								onClick={() => setIsLogin(false)}
							>
								Sign Up
							</button>
						</div>

						{/* Form Content */}
						<AnimatePresence mode="wait">
							<motion.div
								key={isLogin ? "login" : "signup"}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.2 }}
							>
								{isLogin ? <Login /> : <SignUp />}
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
