import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Lenis from "lenis";
import { useUser } from "../features/auth/hooks/useAuth";
import { useDarkMode } from "../shared/context/DarkModeContext";
import {
	HiArrowRight,
	HiAcademicCap,
	HiBolt,
	HiUserGroup,
	HiSun,
	HiMoon,
	HiChartBar,
	HiShieldCheck,
	HiClock,
	HiSparkles,
	HiRocketLaunch,
	HiCheckCircle,
} from "react-icons/hi2";

const FEATURES = [
	{
		icon: HiAcademicCap,
		title: "Expert Content",
		description:
			"Curated quizzes across various subjects designed by educators with years of teaching experience.",
		color: "from-blue-500 to-cyan-500",
	},
	{
		icon: HiBolt,
		title: "Instant Feedback",
		description:
			"Get detailed explanations and results as soon as you finish with comprehensive analytics.",
		color: "from-yellow-500 to-orange-500",
	},
	{
		icon: HiUserGroup,
		title: "Community Driven",
		description:
			"Share quizzes and compete with students worldwide on our global leaderboards.",
		color: "from-purple-500 to-pink-500",
	},
	{
		icon: HiChartBar,
		title: "Advanced Analytics",
		description:
			"Track your progress with detailed statistics and performance metrics over time.",
		color: "from-green-500 to-emerald-500",
	},
	{
		icon: HiShieldCheck,
		title: "Secure & Reliable",
		description:
			"Your data is protected with enterprise-grade security and 99.9% uptime guarantee.",
		color: "from-red-500 to-rose-500",
	},
	{
		icon: HiClock,
		title: "Flexible Timing",
		description:
			"Set custom time limits, deadlines, and allow multiple attempts for any quiz.",
		color: "from-indigo-500 to-violet-500",
	},
];

const STATS = [
	{ label: "Quizzes Taken", val: "250k+", icon: "📝" },
	{ label: "Active Users", val: "5k+", icon: "👥" },
	{ label: "Success Rate", val: "94%", icon: "🎯" },
	{ label: "Quiz Topics", val: "1.2k+", icon: "📚" },
];

const TESTIMONIALS = [
	{
		name: "Sarah Johnson",
		role: "High School Teacher",
		text: "QuizMaster has transformed how I assess my students. The analytics are incredible!",
		avatar: "https://i.pravatar.cc/150?u=sarah",
	},
	{
		name: "Michael Chen",
		role: "University Student",
		text: "I improved my grades significantly using QuizMaster for exam preparation.",
		avatar: "https://i.pravatar.cc/150?u=michael",
	},
	{
		name: "Emily Brown",
		role: "Corporate Trainer",
		text: "Perfect for employee training assessments. Easy to use and powerful analytics.",
		avatar: "https://i.pravatar.cc/150?u=emily",
	},
];

// Animation variants
const fadeInUp = {
	hidden: { opacity: 0, y: 60 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
};

const Navbar = () => {
	const { data: user } = useUser();
	const { isDarkMode, toggleDarkMode } = useDarkMode();

	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-colors duration-300"
			aria-label="Main navigation"
		>
			<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
				<Link
					to="/"
					className="flex items-center gap-3 group"
					aria-label="QuizMaster Home"
				>
					<div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
						Q
					</div>
					<span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
						QUIZ
						<span className="text-indigo-600 dark:text-indigo-400">MASTER</span>
					</span>
				</Link>
				<div className="flex items-center gap-4">
					<button
						onClick={toggleDarkMode}
						className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 hover:scale-110 active:scale-90 transition-all duration-300"
						aria-label="Toggle Dark Mode"
					>
						{isDarkMode ? (
							<HiSun className="text-xl" />
						) : (
							<HiMoon className="text-xl" />
						)}
					</button>

					{user ? (
						<Link
							to="/app/dashboard"
							className="flex items-center gap-3 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all active:scale-95 group"
						>
							<div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:rotate-12 transition-transform">
								{user.name.charAt(0).toUpperCase()}
							</div>
							<span className="text-sm font-bold">Dashboard</span>
						</Link>
					) : (
						<>
							<Link
								to="/welcome"
								className="hidden sm:block text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
							>
								Login
							</Link>
							<Link
								to="/welcome"
								className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all active:scale-95"
							>
								Get Started
							</Link>
						</>
					)}
				</div>
			</div>
		</motion.nav>
	);
};

const Hero = () => {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start start", "end start"],
	});
	const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
	const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

	return (
		<section
			ref={ref}
			className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden bg-gradient-to-br from-white via-indigo-50/50 to-purple-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
		>
			<motion.div
				style={{ y, opacity }}
				className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10"
			>
				{/* Left Content */}
				<div className="relative z-10">
					<motion.div
						initial={{ opacity: 0, x: -60 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2 }}
							className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-bold rounded-full mb-6"
						>
							<HiSparkles className="text-yellow-500" />
							The #1 Quiz Platform for Education
						</motion.div>

						<h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
							Master Any <br />
							<span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
								Subject
							</span>{" "}
							with Quizzes
						</h1>

						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mb-8 leading-relaxed">
							Create engaging quizzes, track student progress, and unlock
							powerful insights. The ultimate platform for teachers and students
							to excel.
						</p>

						{/* Feature pills */}
						<motion.div
							initial="hidden"
							animate="visible"
							variants={staggerContainer}
							className="flex flex-wrap gap-3 mb-8"
						>
							{[
								{ icon: "🎯", text: "Smart Analytics" },
								{ icon: "⚡", text: "Instant Results" },
								{ icon: "📱", text: "Mobile Ready" },
								{ icon: "🏆", text: "Leaderboards" },
							].map((item, i) => (
								<motion.span
									key={i}
									variants={fadeInUp}
									className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full border border-gray-200 dark:border-gray-700 shadow-sm"
								>
									<span>{item.icon}</span>
									{item.text}
								</motion.span>
							))}
						</motion.div>

						<div className="flex flex-col sm:flex-row gap-4">
							<Link
								to="/welcome"
								className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95"
							>
								<HiRocketLaunch className="text-xl group-hover:rotate-12 transition-transform" />
								Get Started Free
								<HiArrowRight className="group-hover:translate-x-1 transition-transform" />
							</Link>

							<div className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
								<div className="flex -space-x-3">
									{[1, 2, 3, 4].map((i) => (
										<img
											key={i}
											src={`https://i.pravatar.cc/40?u=user${i}`}
											alt=""
											className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-800"
										/>
									))}
								</div>
								<div>
									<p className="text-sm font-bold text-gray-900 dark:text-white">
										5,000+ users
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										Join them today
									</p>
								</div>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Right Content - Visual */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
					animate={{ opacity: 1, scale: 1, rotate: 0 }}
					transition={{ duration: 1, delay: 0.3 }}
					className="relative hidden lg:block"
				>
					<div className="relative">
						{/* Main Card */}
						<div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 transform rotate-2 hover:rotate-0 transition-transform duration-500">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
									<HiAcademicCap className="text-2xl" />
								</div>
								<div>
									<p className="font-bold text-gray-900 dark:text-white">
										Mathematics Quiz
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										10 Questions • 30 min
									</p>
								</div>
							</div>
							<div className="space-y-3 mb-6">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className={`p-4 rounded-xl border-2 ${
											i === 1
												? "border-green-500 bg-green-50 dark:bg-green-900/20"
												: "border-gray-200 dark:border-gray-700"
										} flex items-center gap-3`}
									>
										<div
											className={`w-5 h-5 rounded-full border-2 ${
												i === 1
													? "border-green-500 bg-green-500"
													: "border-gray-300 dark:border-gray-600"
											} flex items-center justify-center`}
										>
											{i === 1 && (
												<HiCheckCircle className="text-white text-xs" />
											)}
										</div>
										<div
											className={`h-3 rounded ${
												i === 1
													? "bg-green-300 dark:bg-green-700"
													: "bg-gray-200 dark:bg-gray-700"
											} w-24`}
										/>
									</div>
								))}
							</div>
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
									<HiClock />
									<span>15:30 remaining</span>
								</div>
								<button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl">
									Submit
								</button>
							</div>
						</div>

						{/* Floating stats */}
						<motion.div
							animate={{ y: [0, -10, 0] }}
							transition={{ duration: 3, repeat: Infinity }}
							className="absolute -top-8 -right-8 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-700"
						>
							<p className="text-2xl font-black text-green-500">98%</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Accuracy
							</p>
						</motion.div>

						<motion.div
							animate={{ y: [0, 10, 0] }}
							transition={{ duration: 4, repeat: Infinity }}
							className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-700"
						>
							<p className="text-2xl font-black text-indigo-500">🏆</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Top 10%
							</p>
						</motion.div>
					</div>
				</motion.div>
			</motion.div>

			{/* Background elements */}
			<div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-50" />
			<div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-50" />
		</section>
	);
};

const Features = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section
			ref={ref}
			className="py-24 px-6 bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
		>
			<div className="max-w-7xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<span className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-bold rounded-full mb-4">
						FEATURES
					</span>
					<h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
						Everything You Need to{" "}
						<span className="text-indigo-600 dark:text-indigo-400">Excel</span>
					</h2>
					<p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
						Powerful tools for creating, taking, and analyzing quizzes. Built
						for modern education.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{FEATURES.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 40 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							whileHover={{ y: -8, scale: 1.02 }}
							className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 cursor-default"
						>
							<div
								className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}
							>
								<feature.icon className="text-2xl" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
								{feature.title}
							</h3>
							<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

const Testimonials = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section ref={ref} className="py-24 px-6 bg-white dark:bg-gray-900">
			<div className="max-w-7xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					className="text-center mb-16"
				>
					<span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-bold rounded-full mb-4">
						TESTIMONIALS
					</span>
					<h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
						Loved by{" "}
						<span className="text-purple-600 dark:text-purple-400">
							Thousands
						</span>
					</h2>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{TESTIMONIALS.map((testimonial, index) => (
						<motion.div
							key={testimonial.name}
							initial={{ opacity: 0, y: 40 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: index * 0.1 }}
							className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700"
						>
							<p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
								"{testimonial.text}"
							</p>
							<div className="flex items-center gap-4">
								<img
									src={testimonial.avatar}
									alt={testimonial.name}
									className="w-12 h-12 rounded-full"
									referrerPolicy="no-referrer"
									loading="lazy"
								/>
								<div>
									<p className="font-bold text-gray-900 dark:text-white">
										{testimonial.name}
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{testimonial.role}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

const Stats = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section
			ref={ref}
			className="py-24 px-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden"
		>
			<div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
				<motion.div
					initial={{ opacity: 0, x: -40 }}
					animate={isInView ? { opacity: 1, x: 0 } : {}}
				>
					<h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
						Ready to Transform Your Learning?
					</h2>
					<p className="text-indigo-100 text-lg mb-8 leading-relaxed">
						Join thousands of educators and students who are already using
						QuizMaster to achieve their goals.
					</p>
					<Link
						to="/welcome"
						className="inline-flex px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
					>
						Start for Free
					</Link>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: 40 }}
					animate={isInView ? { opacity: 1, x: 0 } : {}}
					className="grid grid-cols-2 gap-4"
				>
					{STATS.map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={isInView ? { opacity: 1, scale: 1 } : {}}
							transition={{ delay: index * 0.1 }}
							className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl text-center"
						>
							<span className="text-3xl mb-2 block">{stat.icon}</span>
							<p className="text-3xl font-black text-white">{stat.val}</p>
							<p className="text-indigo-200 text-sm font-medium">
								{stat.label}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>

			<div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
			<div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl" />
		</section>
	);
};

const Footer = () => (
	<footer className="py-16 px-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
		<div className="max-w-7xl mx-auto">
			<div className="flex flex-col md:flex-row justify-between items-center gap-8">
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
						Q
					</div>
					<span className="text-2xl font-black text-gray-900 dark:text-white">
						QUIZ
						<span className="text-indigo-600 dark:text-indigo-400">MASTER</span>
					</span>
				</div>
				<nav className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
					<button className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
						Privacy
					</button>
					<button className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
						Terms
					</button>
					<button className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
						Contact
					</button>
				</nav>
				<p className="text-sm text-gray-500 dark:text-gray-500">
					© {new Date().getFullYear()} QuizMaster. All rights reserved.
				</p>
			</div>
		</div>
	</footer>
);

const Landing = () => {
	useEffect(() => {
		// Initialize Lenis for smooth scrolling
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: "vertical",
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2,
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

	return (
		<div className="relative bg-white dark:bg-gray-900 overflow-hidden selection:bg-indigo-100 dark:selection:bg-indigo-900/50 selection:text-indigo-600 dark:selection:text-indigo-400">
			<Navbar />
			<Hero />
			<Features />
			<Testimonials />
			<Stats />
			<Footer />
		</div>
	);
};

export default Landing;
