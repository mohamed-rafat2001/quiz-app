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

const FEATURES = [
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
		description: "Get detailed explanations and results as soon as you finish.",
		color: "bg-yellow-500",
	},
	{
		icon: HiUserGroup,
		title: "Community Driven",
		description: "Share quizzes and compete with students worldwide.",
		color: "bg-purple-500",
	},
];

const STATS = [
	{ label: "Quizzes Taken", val: "250k+" },
	{ label: "Active Users", val: "5k+" },
	{ label: "Success Rate", val: "94%" },
	{ label: "Quiz Topics", val: "1.2k+" },
];

const Navbar = () => {
	const { data: user } = useUser();

	return (
		<nav
			className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
			aria-label="Main navigation"
		>
			<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
				<Link
					to="/"
					className="flex items-center gap-2"
					aria-label="QuizApp Home"
				>
					<div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
						Q
					</div>
					<span className="text-xl font-black text-gray-900 tracking-tight uppercase">
						QuizApp
					</span>
				</Link>
				<div className="flex items-center gap-6">
					{user ? (
						<Link
							to="/app/dashboard"
							className="flex items-center gap-3 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-100 transition-all active:scale-95 group"
						>
							<div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-sm group-hover:rotate-12 transition-transform">
								{user.name.charAt(0).toUpperCase()}
							</div>
							<span className="text-sm">Dashboard</span>
						</Link>
					) : (
						<>
							<Link
								to="/welcome"
								className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors"
								aria-label="Login to your account"
							>
								Login
							</Link>
							<Link
								to="/welcome"
								className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
								aria-label="Get started for free"
							>
								Get Started
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

const Hero = ({ opacity, scale }) => {
	const { scrollYProgress } = useScroll();
	const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
	const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
	const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

	return (
		<section
			className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden"
			aria-labelledby="hero-heading"
		>
			<motion.div
				style={{ opacity, scale }}
				className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
			>
				<div className="relative z-10">
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
					>
						<motion.span
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2 }}
							className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-full mb-6"
						>
							✨ The Ultimate Learning Platform
						</motion.span>
						<h1
							id="hero-heading"
							className="text-6xl lg:text-8xl font-black text-gray-900 leading-[0.9] mb-8 tracking-tighter"
						>
							Unlock Your <br />
							<motion.span
								initial={{ color: "#111827" }}
								animate={{ color: "#4f46e5" }}
								transition={{ delay: 1, duration: 1 }}
								className="relative inline-block"
							>
								Potential.
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: "100%" }}
									transition={{ delay: 1.5, duration: 0.8 }}
									className="absolute bottom-2 left-0 h-2 bg-indigo-100 -z-10"
								/>
							</motion.span>
						</h1>
						<p className="text-xl text-gray-500 max-w-lg mb-10 leading-relaxed font-medium">
							Master any subject with our interactive quizzes. Join over 5,000+
							learners today and start your journey to excellence.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<Link
								to="/welcome"
								className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 group overflow-hidden relative"
								aria-label="Start learning now"
							>
								<span className="relative z-10">Start Learning Now</span>
								<HiArrowRight
									className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10"
									aria-hidden="true"
								/>
								<motion.div
									whileHover={{ x: "100%" }}
									initial={{ x: "-100%" }}
									transition={{ duration: 0.5 }}
									className="absolute inset-0 bg-linear-to-r from-indigo-500 to-indigo-600 z-0"
								/>
							</Link>
							<div className="flex items-center gap-4 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
								<div className="flex -space-x-3" aria-hidden="true">
									{[1, 2, 3, 4].map((i) => (
										<motion.div
											key={i}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.5 + i * 0.1 }}
											className="w-10 h-10 rounded-full border-2 border-white bg-indigo-400 overflow-hidden"
										>
											<img
												src={`https://i.pravatar.cc/150?u=user${i}`}
												alt="User avatar"
												className="w-full h-full object-cover"
											/>
										</motion.div>
									))}
								</div>
								<div className="text-sm font-bold text-gray-900">
									5k+ Students Joined
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
					aria-hidden="true"
				>
					<motion.div
						style={{ y: y1, rotate }}
						className="aspect-square bg-linear-to-tr from-indigo-100 to-purple-100 rounded-[4rem] relative overflow-hidden shadow-inner"
					>
						<div className="absolute inset-0 flex items-center justify-center p-12">
							<motion.div
								whileHover={{ rotate: 0, scale: 1.05 }}
								className="w-full h-full bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 transition-all duration-500"
							>
								<div className="w-12 h-12 bg-indigo-100 rounded-2xl mb-6 flex items-center justify-center text-indigo-600">
									<HiAcademicCap className="w-6 h-6" />
								</div>
								<div className="space-y-4">
									<div className="h-6 bg-gray-100 rounded-lg w-3/4 animate-pulse" />
									<div className="h-4 bg-gray-50 rounded-lg w-full" />
									<div className="h-4 bg-gray-50 rounded-lg w-5/6" />
									<div className="grid grid-cols-2 gap-4 pt-4">
										{[1, 2, 3, 4].map((i) => (
											<div
												key={i}
												className={`h-12 border-2 ${
													i === 1
														? "border-indigo-500 bg-indigo-50"
														: "border-gray-100"
												} rounded-xl flex items-center justify-center`}
											>
												<div
													className={`w-2 h-2 rounded-full ${
														i === 1 ? "bg-indigo-500" : "bg-gray-200"
													} mr-2`}
												/>
												<div
													className={`h-2 ${
														i === 1 ? "bg-indigo-200" : "bg-gray-100"
													} rounded w-12`}
												/>
											</div>
										))}
									</div>
								</div>
							</motion.div>
						</div>
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_60%)] from-indigo-200/40 pointer-events-none" />
					</motion.div>

					{/* Floating decorative elements */}
					<motion.div
						style={{ y: y2 }}
						animate={{
							y: [0, -20, 0],
							rotate: [0, 10, 0],
						}}
						transition={{
							duration: 5,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200/50 rounded-full blur-2xl"
					/>
					<motion.div
						style={{ y: y1 }}
						animate={{
							y: [0, 20, 0],
							rotate: [0, -10, 0],
						}}
						transition={{
							duration: 6,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-200/50 rounded-full blur-2xl"
					/>
				</motion.div>
			</motion.div>

			<div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60" />
			<div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-purple-50 rounded-full blur-3xl -z-10 opacity-60" />
		</section>
	);
};

const Features = () => (
	<section className="py-32 px-6 bg-gray-50" aria-labelledby="features-heading">
		<div className="max-w-7xl mx-auto">
			<div className="text-center mb-24">
				<motion.h2
					id="features-heading"
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
				{FEATURES.map((feature) => (
					<motion.div
						key={feature.title}
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
					>
						<div
							className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform`}
							aria-hidden="true"
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
);

const Stats = () => (
	<section
		className="py-32 px-6 relative overflow-hidden bg-indigo-600"
		aria-labelledby="stats-heading"
	>
		<div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
			<div>
				<h2
					id="stats-heading"
					className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight tracking-tight"
				>
					Ready to start <br /> your journey?
				</h2>
				<p className="text-indigo-100 text-xl font-medium mb-12 leading-relaxed">
					Join thousands of users who have already transformed their learning
					experience. It&apos;s free to start and easy to use.
				</p>
				<Link
					to="/welcome"
					className="inline-flex px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl shadow-2xl hover:bg-gray-50 transition-all transform hover:-translate-y-1"
					aria-label="Create your free account"
				>
					Create Free Account
				</Link>
			</div>
			<div className="grid grid-cols-2 gap-8">
				{STATS.map((stat) => (
					<div
						key={stat.label}
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

		<div
			className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
			aria-hidden="true"
		>
			<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
			<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
		</div>
	</section>
);

const Footer = () => (
	<footer className="py-20 px-6 border-t border-gray-100" aria-label="Footer">
		<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
			<div className="flex items-center gap-2">
				<div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
					Q
				</div>
				<span className="text-lg font-black text-gray-900 tracking-tight uppercase">
					QuizApp
				</span>
			</div>
			<nav
				className="flex gap-10 text-sm font-bold text-gray-500"
				aria-label="Footer navigation"
			>
				<button className="hover:text-indigo-600 transition-colors cursor-pointer">
					Privacy Policy
				</button>
				<button className="hover:text-indigo-600 transition-colors cursor-pointer">
					Terms of Service
				</button>
				<button className="hover:text-indigo-600 transition-colors cursor-pointer">
					Contact
				</button>
			</nav>
			<div className="text-sm font-medium text-gray-400">
				© {new Date().getFullYear()} QuizApp. All rights reserved.
			</div>
		</div>
	</footer>
);

const Landing = () => {
	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
		});

		let rafId;
		function raf(time) {
			lenis.raf(time);
			rafId = requestAnimationFrame(raf);
		}

		rafId = requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
			cancelAnimationFrame(rafId);
		};
	}, []);

	const { scrollYProgress } = useScroll();
	const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
	const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

	return (
		<div className="bg-white overflow-hidden selection:bg-indigo-100 selection:text-indigo-600">
			<Navbar />
			<Hero opacity={opacity} scale={scale} />
			<Features />
			<Stats />
			<Footer />
		</div>
	);
};

export default Landing;
