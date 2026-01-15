import { NavLink } from "react-router-dom";
import { useUser, useLogout } from "../../../features/auth/hooks/useAuth";
import {
	HiHome,
	HiUser,
	HiClipboardDocumentCheck,
	HiListBullet,
	HiUsers,
	HiAcademicCap,
	HiChartBar,
	HiArrowRightOnRectangle,
} from "react-icons/hi2";

export default function SideBar() {
	const { data: user } = useUser();
	const logout = useLogout();

	const navItems = [
		{ to: "/dashboard", icon: HiChartBar, label: "Dashboard" },
		{ to: "/home", icon: HiHome, label: "Home" },
		{ to: "/profile", icon: HiUser, label: "Profile" },
	];

	if (user?.role === "admin") {
		navItems.push(
			{ to: "/admin/users", icon: HiUsers, label: "Users" },
			{ to: "/admin/quizzes", icon: HiAcademicCap, label: "All Quizzes" }
		);
	} else {
		navItems.push(
			{ to: "/Quizs", icon: HiListBullet, label: "Quizzes" },
			{
				to: "/QuizAnswers",
				icon: HiClipboardDocumentCheck,
				label: "My Answers",
			}
		);
	}

	// Adjust labels for teacher
	if (user?.role === "teacher") {
		const quizItem = navItems.find((item) => item.to === "/Quizs");
		if (quizItem) quizItem.label = "Manage Quizzes";
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
			<div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex-col z-50">
				<div className="p-8">
					<div className="flex items-center gap-3 mb-12">
						<div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
							Q
						</div>
						<h1 className="font-extrabold text-gray-900 text-lg tracking-tight">
							QUIZ APP
						</h1>
					</div>

					<nav className="space-y-2">
						{navItems.map((item) => (
							<NavLink
								key={item.to}
								to={item.to}
								className={({ isActive }) =>
									`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
										isActive
											? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
											: "text-gray-500 hover:bg-gray-50"
									}`
								}
							>
								<item.icon
									className={`text-xl transition-colors duration-300 group-hover:scale-110`}
								/>
								<span className="font-bold text-sm tracking-wide">
									{item.label}
								</span>
							</NavLink>
						))}
					</nav>
				</div>

				<div className="mt-auto p-8 border-t border-gray-50">
					<div className="bg-gray-50 rounded-3xl p-6 mb-6">
						<div className="flex items-center gap-3 mb-1">
							<div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold uppercase">
								{user?.name?.charAt(0)}
							</div>
							<div className="min-w-0">
								<p className="font-bold text-gray-900 text-sm truncate">
									{user?.name}
								</p>
								<p className="text-xs text-gray-400 font-medium capitalize">
									{user?.role}
								</p>
							</div>
						</div>
					</div>

					<button
						onClick={handleLogout}
						className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-300 group"
					>
						<HiArrowRightOnRectangle className="text-xl group-hover:translate-x-1 transition-transform" />
						<span className="font-bold text-sm tracking-wide">Logout</span>
					</button>
				</div>
			</div>
		</>
	);
}
