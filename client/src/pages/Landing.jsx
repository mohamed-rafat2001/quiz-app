import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import {
	HiArrowRight,
	HiAcademicCap,
	HiBolt,
	HiUserGroup,
} from "react-icons/hi2";

const Landing = () => {
	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
		});

		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
		};
	}, []);

	const { scrollYProgress } = useScroll();
	const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
	const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

	const features = [
		{
			icon: HiAcademicCap,
			title: "Expert Content",
			description:
				"Curated quizzes across various subjects designed by educators.",
			color: "bg-blue-500",
		},
		{
			icon: HiBolt,
			title: "Instant Feedback",
			description:
				"Get detailed explanations and results as soon as you finish.",
			color: "bg-yellow-500",
		},
		{
			icon: HiUserGroup,
			title: "Community Driven",
			description: "Share quizzes and compete with students worldwide.",
			color: "bg-purple-500",
		},
	];

	return (
		<div className="bg-white overflow-hidden">
			{/* Navbar */}
			<nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
				<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
							Q
						</div>
						<span className="text-xl font-black text-gray-900 tracking-tight uppercase">
							QuizApp
						</span>
					</div>
					<div className="flex items-center gap-8">
						<Link
							to="/welcome"
							className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors"
						>
							Login
						</Link>
						<Link
							to="/welcome"
							className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
						>
							Get Started
						</Link>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center pt-20 px-6">
				<motion.div
					style={{ opacity, scale }}
					className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
				>
					<div className="relative z-10">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
						>
							<span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-full mb-6">
								The Ultimate Learning Platform
							</span>
							<h1 className="text-6xl lg:text-8xl font-black text-gray-900 leading-[0.9] mb-8 tracking-tighter">
								Unlock Your <br />
								<span className="text-indigo-600">Potential.</span>
							</h1>
							<p className="text-xl text-gray-500 max-w-lg mb-10 leading-relaxed font-medium">
								Master any subject with our interactive quizzes. Join over
								5,000+ learners today and start your journey to excellence.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Link
									to="/welcome"
									className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 group"
								>
									Start Learning Now
									<HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</Link>
								<div className="flex items-center gap-4 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
									<div className="flex -space-x-3">
										{[1, 2, 3].map((i) => (
											<div
												key={i}
												className="w-10 h-10 rounded-full border-2 border-white bg-indigo-400"
											/>
										))}
									</div>
									<div className="text-sm font-bold text-gray-900">
										5k+ Students
									</div>
								</div>
							</div>
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
						animate={{ opacity: 1, scale: 1, rotate: 0 }}
						transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
						className="relative"
					>
						<div className="aspect-square bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-[4rem] relative overflow-hidden shadow-inner">
							<div className="absolute inset-0 flex items-center justify-center p-12">
								<div className="w-full h-full bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
									{/* Mock Quiz Card */}
									<div className="w-12 h-12 bg-indigo-100 rounded-2xl mb-6 flex items-center justify-center text-indigo-600">
										<HiAcademicCap className="w-6 h-6" />
									</div>
									<div className="space-y-4">
										<div className="h-6 bg-gray-100 rounded-lg w-3/4" />
										<div className="h-4 bg-gray-50 rounded-lg w-full" />
										<div className="h-4 bg-gray-50 rounded-lg w-5/6" />
										<div className="grid grid-cols-2 gap-4 pt-4">
											<div className="h-12 border-2 border-indigo-500 bg-indigo-50 rounded-xl" />
											<div className="h-12 border-2 border-gray-100 rounded-xl" />
											<div className="h-12 border-2 border-gray-100 rounded-xl" />
											<div className="h-12 border-2 border-gray-100 rounded-xl" />
										</div>
									</div>
								</div>
							</div>
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_60%)] from-indigo-200/40 pointer-events-none" />
						</div>
					</motion.div>
				</motion.div>

				{/* Decorative Background Elements */}
				<div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60" />
				<div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-purple-50 rounded-full blur-3xl -z-10 opacity-60" />
			</section>

			{/* Features Section */}
			<section className="py-32 px-6 bg-gray-50">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-24">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight"
						>
							Elevate Your <span className="text-indigo-600">Learning</span>
						</motion.h2>
						<p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
							Everything you need to master your studies and track your progress
							effectively in one place.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								className="bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
							>
								<div
									className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform`}
								>
									<feature.icon className="w-8 h-8" />
								</div>
								<h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
									{feature.title}
								</h3>
								<p className="text-gray-500 font-medium leading-relaxed">
									{feature.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-32 px-6 relative overflow-hidden bg-indigo-600">
				<div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
					<div>
						<h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight tracking-tight">
							Ready to start <br /> your journey?
						</h2>
						<p className="text-indigo-100 text-xl font-medium mb-12 leading-relaxed">
							Join thousands of users who have already transformed their
							learning experience. It's free to start and easy to use.
						</p>
						<Link
							to="/welcome"
							className="inline-flex px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl shadow-2xl hover:bg-gray-50 transition-all transform hover:-translate-y-1"
						>
							Create Free Account
						</Link>
					</div>
					<div className="grid grid-cols-2 gap-8">
						{[
							{ label: "Quizzes Taken", val: "250k+" },
							{ label: "Active Users", val: "5k+" },
							{ label: "Success Rate", val: "94%" },
							{ label: "Quiz Topics", val: "1.2k+" },
						].map((stat, i) => (
							<div
								key={i}
								className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl"
							>
								<div className="text-4xl font-black text-white mb-2">
									{stat.val}
								</div>
								<div className="text-indigo-100 font-bold text-sm uppercase tracking-wider">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Abstract shapes */}
				<div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
					<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
					<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
				</div>
			</section>

			{/* Footer */}
			<footer className="py-20 px-6 border-t border-gray-100">
				<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
							Q
						</div>
						<span className="text-lg font-black text-gray-900 tracking-tight uppercase">
							QuizApp
						</span>
					</div>
					<div className="flex gap-10 text-sm font-bold text-gray-500">
						<a href="#" className="hover:text-indigo-600 transition-colors">
							Privacy Policy
						</a>
						<a href="#" className="hover:text-indigo-600 transition-colors">
							Terms of Service
						</a>
						<a href="#" className="hover:text-indigo-600 transition-colors">
							Contact
						</a>
					</div>
					<div className="text-sm font-medium text-gray-400">
						© 2026 QuizApp. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Landing;
