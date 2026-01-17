import { NavLink, Link } from "react-router-dom";
import { useUser, useLogout } from "../../../features/auth/hooks/useAuth";
import {
	HiHome,
	HiUser,
	HiClipboardDocumentCheck,
	HiListBullet,
	HiUsers,
	HiAcademicCap,
	HiChartBar,
	HiPlusCircle,
} from "react-icons/hi2";

export const Logo = ({ size = "lg" }) => (
	<Link to="/" className="flex items-center gap-3 group">
		<div
			className={`${
				size === "lg" ? "w-12 h-12 text-2xl" : "w-10 h-10 text-xl"
			} bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-indigo-100 dark:shadow-indigo-950/20 group-hover:scale-110 transition-transform duration-300`}
		>
			Q
		</div>
		<div className="flex flex-col">
			<h1
				className={`font-black text-gray-900 dark:text-white tracking-tighter leading-none ${
					size === "lg" ? "text-xl" : "text-lg"
				}`}
			>
				QUIZ<span className="text-indigo-600">APP</span>
			</h1>
			<span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
				Platform
			</span>
		</div>
	</Link>
);

const NavItem = ({ to, icon: Icon, label, mobile = false }) => (
	<NavLink
		to={to}
		end={to === "/app/quizzes" || to === "/app/home" || to === "/app/dashboard"}
		className={({ isActive }) =>
			mobile
				? `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
						isActive
							? "text-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10"
							: "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
				  }`
				: `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative border-2 ${
						isActive
							? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-[1.02] border-indigo-400/50"
							: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.03] hover:text-indigo-600 dark:hover:text-white border-transparent hover:border-gray-200/50 dark:hover:border-white/5"
				  }`
		}
	>
		{({ isActive }) => (
			<>
				<Icon
					className={`${
						mobile
							? "text-xl"
							: "text-xl transition-all duration-300 group-hover:scale-110"
					} ${
						!mobile &&
						!isActive &&
						"group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
					}`}
				/>
				<span
					className={`${
						mobile
							? "text-[10px] font-bold uppercase tracking-wider"
							: "font-bold text-sm tracking-wide"
					}`}
				>
					{label}
				</span>
				{!mobile && isActive && (
					<div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white/40 shadow-sm" />
				)}
			</>
		)}
	</NavLink>
);

export const UserProfile = ({ user }) => (
	<div className="flex items-center gap-4">
		<div className="relative group/avatar">
			<div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20 group-hover/avatar:rotate-12 transition-transform duration-500">
				{user?.name?.charAt(0).toUpperCase()}
			</div>
			<div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-white/5 rounded-full shadow-sm" />
		</div>
		<div className="min-w-0 hidden sm:block">
			<p className="font-black text-gray-900 dark:text-white text-sm truncate leading-tight tracking-tight">
				{user?.name}
			</p>
			<p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.15em] mt-1 opacity-70">
				{user?.role}
			</p>
		</div>
	</div>
);

export default function SideBar() {
	const { data: user } = useUser();
	const logout = useLogout();

	const getNavItems = () => {
		const items = [
			{ to: "/app/dashboard", icon: HiChartBar, label: "Dashboard" },
		];

		if (user?.role === "admin") {
			items.push(
				{ to: "/app/admin/users", icon: HiUsers, label: "User Management" },
				{ to: "/app/admin/quizzes", icon: HiAcademicCap, label: "All Quizzes" }
			);
		}

		if (user?.role === "teacher") {
			items.push(
				{ to: "/app/quizzes", icon: HiListBullet, label: "Manage Quizzes" },
				{ to: "/app/quizzes/create", icon: HiPlusCircle, label: "Create Quiz" }
			);
		}

		if (user?.role === "student") {
			items.push(
				{ to: "/app/home", icon: HiHome, label: "Start Quiz" },
				{ to: "/app/quizzes", icon: HiListBullet, label: "Available Quizzes" },
				{
					to: "/app/my-submissions",
					icon: HiClipboardDocumentCheck,
					label: "My Submissions",
				}
			);
		}

		items.push({ to: "/app/profile", icon: HiUser, label: "My Profile" });
		return items;
	};

	const navItems = getNavItems();

	return (
		<>
			{/* Mobile Bottom Navigation */}
			<div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl border-t border-gray-100 dark:border-white/5 flex items-center justify-around px-4 pb-2 z-50 transition-colors duration-300">
				{navItems.map((item) => (
					<NavItem key={item.to} {...item} mobile />
				))}
			</div>

			<div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-white/[0.02] border-r border-gray-100 dark:border-white/5 flex-col z-50 transition-colors duration-300">
				<div className="p-8 flex-1 overflow-y-auto custom-scrollbar min-h-0">
					<div className="mb-12">
						<Logo />
					</div>

					<div className="space-y-8">
						<div>
							<span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-6 mb-4 block">
								Main Menu
							</span>
							<nav className="space-y-2">
								{navItems.map((item) => (
									<NavItem key={item.to} {...item} />
								))}
							</nav>
						</div>
					</div>
				</div>

				<div className="p-8 border-t border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.02] shrink-0">
					<button
						onClick={() => logout()}
						className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group font-black text-sm tracking-wide active:scale-95"
					>
						<div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
							<HiArrowRightOnRectangle className="text-xl" />
						</div>
						Sign Out
					</button>
				</div>
			</div>
		</>
	);
}
