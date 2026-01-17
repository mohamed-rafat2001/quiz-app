import { Suspense, useState, useRef, useEffect } from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import SideBar, { UserProfile, Logo } from "./SideBar";
import Loader from "./Loader";
import { useUser, useLogout } from "../../../features/auth/hooks/useAuth";
import {
	HiArrowRightOnRectangle,
	HiSun,
	HiMoon,
	HiChevronDown,
	HiUser,
} from "react-icons/hi2";
import { useDarkMode } from "../../context/DarkModeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AppLayout() {
	const { data: user, isLoading: isUserLoading } = useUser();
	const logout = useLogout();
	const { isDarkMode, toggleDarkMode } = useDarkMode();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	if (isUserLoading) return <Loader />;

	if (!user) {
		return <Navigate to="/welcome" replace />;
	}

	const handleLogout = () => {
		setIsDropdownOpen(false);
		logout();
	};

	return (
		<div className="h-screen bg-gray-50/50 dark:bg-white/[0.02] flex flex-col lg:flex-row overflow-hidden transition-colors duration-300">
			{/* Sidebar - Desktop is fixed, Mobile is top/bottom */}
			<div className="lg:w-72 shrink-0">
				<SideBar />
			</div>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Header - Visible on all screens */}
				<header className="fixed lg:static top-0 left-0 right-0 h-20 bg-white/80 dark:bg-white/[0.02] backdrop-blur-xl border-b border-gray-100 dark:border-white/5 flex items-center justify-between lg:justify-end px-6 lg:px-12 shrink-0 z-50 transition-colors duration-300">
					<div className="lg:hidden">
						<Logo size="sm" />
					</div>

					<div className="flex items-center gap-4 lg:gap-6">
						<button
							onClick={toggleDarkMode}
							className="p-3 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 text-indigo-600 dark:text-indigo-400 hover:scale-110 active:scale-90 transition-all duration-300 shadow-sm"
							aria-label="Toggle Dark Mode"
						>
							{isDarkMode ? (
								<HiSun className="text-xl" />
							) : (
								<HiMoon className="text-xl" />
							)}
						</button>

						<div className="w-px h-8 bg-gray-100 dark:bg-white/5" />

						{/* User Dropdown */}
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className="flex items-center gap-3 p-2 rounded-[1.5rem] hover:bg-gray-100 dark:hover:bg-white/[0.03] transition-all duration-300 group active:scale-95"
							>
								<UserProfile user={user} />
								<HiChevronDown
									className={`text-gray-400 dark:text-gray-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform duration-500 ${
										isDropdownOpen ? "rotate-180" : ""
									}`}
								/>
							</button>

							<AnimatePresence>
								{isDropdownOpen && (
									<motion.div
										initial={{ opacity: 0, y: 15, scale: 0.95 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, y: 15, scale: 0.95 }}
										transition={{
											type: "spring",
											stiffness: 300,
											damping: 25,
										}}
										className="absolute right-0 mt-4 w-72 bg-white dark:bg-white/[0.08] backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/5 py-4 z-50 overflow-hidden"
									>
										<div className="px-8 py-5 border-b border-gray-100 dark:border-white/5 mb-3 bg-gray-50/50 dark:bg-white/[0.02]">
											<p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">
												Account
											</p>
											<p className="font-black text-gray-900 dark:text-white truncate text-sm">
												{user?.email}
											</p>
										</div>

										<div className="px-3 space-y-1">
											<Link
												to="/app/profile"
												onClick={() => setIsDropdownOpen(false)}
												className="flex items-center gap-4 px-6 py-4 text-sm font-black text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:text-indigo-600 dark:hover:text-white rounded-2xl transition-all group"
											>
												<HiUser className="text-xl group-hover:scale-110 transition-transform" />
												Profile Settings
											</Link>

											<button
												onClick={handleLogout}
												className="w-full flex items-center gap-4 px-6 py-4 text-sm font-black text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all group"
											>
												<HiArrowRightOnRectangle className="text-xl group-hover:scale-110 transition-transform" />
												Sign Out
											</button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
				</header>

				<main className="flex-1 overflow-y-auto pt-20 lg:pt-0 pb-20 lg:pb-0 scroll-smooth">
					<div className="max-w-7xl mx-auto p-4 sm:p-8 lg:p-12">
						<Suspense fallback={<Loader fullPage={false} />}>
							<Outlet />
						</Suspense>
					</div>
				</main>
			</div>
		</div>
	);
}
