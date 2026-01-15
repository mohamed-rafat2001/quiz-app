import { NavLink } from "react-router-dom";
import { useUser, useLogout } from "../../../features/auth/hooks/useAuth";
import { motion } from "framer-motion";
import {
	HiHome,
	HiUser,
	HiClipboardCheck,
	HiListBullet,
	HiArrowRightOnRectangle,
} from "react-icons/hi2";

export default function SideBar() {
	const { data: user } = useUser();
	const logout = useLogout();

	const navItems = [
		{ to: "/home", icon: HiHome, label: "Home" },
		{ to: "/profile", icon: HiUser, label: "Profile" },
		{ to: "/QuizsAsnwers", icon: HiClipboardCheck, label: "My Answers" },
	];

	// Add teacher-only routes
	if (user?.role === "teacher") {
		navItems.push({
			to: "/Quizs",
			icon: HiListBullet,
			label: "Manage Quizzes",
		});
	}

	const handleLogout = () => {
		logout();
	};

	return (
		<>
			{/* Mobile Header */}
			<div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-50">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
						Q
					</div>
					<h5 className="font-bold text-gray-800 text-sm tracking-tight">
						QUIZ APP
					</h5>
				</div>
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 text-xs font-bold uppercase">
						{user?.name?.charAt(0)}
					</div>
				</div>
			</div>

			{/* Mobile Bottom Navigation */}
			<div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around px-2 z-50">
				{navItems.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						className={({ isActive }) =>
							`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 ${
								isActive ? "text-indigo-600" : "text-gray-400"
							}`
						}
					>
						<item.icon className="text-xl" />
						<span className="text-[10px] font-bold uppercase tracking-wider">
							{item.label}
						</span>
					</NavLink>
				))}
				<button
					onClick={handleLogout}
					className="flex flex-col items-center justify-center gap-1 px-3 py-1 text-red-400"
				>
					<HiArrowRightOnRectangle className="text-xl" />
					<span className="text-[10px] font-bold uppercase tracking-wider">
						Logout
					</span>
				</button>
			</div>

			{/* Desktop Sidebar */}
			<motion.div
				initial={{ x: -20, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				className="hidden lg:flex h-screen bg-white border-r border-gray-100 flex-col w-64 transition-all duration-300 fixed left-0 top-0 z-40"
			>
				{/* Logo Section */}
				<div className="p-8 flex items-center gap-3">
					<div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
						Q
					</div>
					<h5 className="font-bold text-gray-800 text-lg tracking-tight">
						QUIZ APP
					</h5>
				</div>

				{/* Navigation Section */}
				<nav className="flex-1 px-4 space-y-2 mt-4">
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							className={({ isActive }) =>
								`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group ${
									isActive
										? "bg-indigo-50 text-indigo-600 shadow-sm"
										: "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
								}`
							}
						>
							<item.icon className="text-xl transition-transform group-hover:scale-110" />
							<span className="font-bold tracking-tight">{item.label}</span>
						</NavLink>
					))}
				</nav>

				{/* User Section / Logout */}
				<div className="p-6 border-t border-gray-50">
					<div className="flex items-center gap-4 px-4 py-3 mb-4">
						<div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
							{user?.name?.charAt(0).toUpperCase()}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-bold text-gray-900 truncate">
								{user?.name}
							</p>
							<p className="text-xs text-gray-500 truncate uppercase tracking-wider">
								{user?.role}
							</p>
						</div>
					</div>
					<button
						onClick={handleLogout}
						className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-200 group"
					>
						<HiArrowRightOnRectangle className="text-xl group-hover:translate-x-1 transition-transform" />
						<span className="font-bold tracking-tight">Logout</span>
					</button>
				</div>
			</motion.div>
		</>
	);
}
