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
	HiArrowRightOnRectangle,
	HiPlusCircle,
} from "react-icons/hi2";

const Logo = ({ size = "lg" }) => (
	<Link to="/" className="flex items-center gap-3 group">
		<div
			className={`${
				size === "lg" ? "w-12 h-12 text-2xl" : "w-10 h-10 text-xl"
			} bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform duration-300`}
		>
			Q
		</div>
		<div className="flex flex-col">
			<h1
				className={`font-black text-gray-900 tracking-tighter leading-none ${
					size === "lg" ? "text-xl" : "text-lg"
				}`}
			>
				QUIZ<span className="text-indigo-600">APP</span>
			</h1>
			<span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
				Platform
			</span>
		</div>
	</Link>
);

const NavItem = ({ to, icon: Icon, label, mobile = false }) => (
	<NavLink
		to={to}
		className={({ isActive }) =>
			mobile
				? `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
						isActive
							? "text-indigo-600 bg-indigo-50"
							: "text-gray-400 hover:text-gray-600"
				  }`
				: `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative border-2 ${
						isActive
							? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02] border-indigo-400"
							: "text-gray-500 hover:bg-indigo-50/80 hover:text-indigo-600 border-transparent hover:border-indigo-100"
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
					} ${!mobile && !isActive && "group-hover:text-indigo-600"}`}
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

const UserProfile = ({ user }) => (
	<div className="bg-gray-50 rounded-4xl p-5 mb-6 border border-gray-100 group hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all duration-500">
		<div className="flex items-center gap-4">
			<div className="relative">
				<div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-transform duration-500">
					{user?.name?.charAt(0).toUpperCase()}
				</div>
				<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
			</div>
			<div className="min-w-0 flex-1">
				<p className="font-black text-gray-900 text-sm truncate leading-tight">
					{user?.name}
				</p>
				<p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mt-1 opacity-70">
					{user?.role}
				</p>
			</div>
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
	const handleLogout = () => logout();

	return (
		<>
			{/* Mobile Header */}
			<div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 z-50">
				<Logo size="sm" />
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-sm font-black shadow-sm">
						{user?.name?.charAt(0).toUpperCase()}
					</div>
				</div>
			</div>

			{/* Mobile Bottom Navigation */}
			<div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-t border-gray-100 flex items-center justify-around px-4 pb-2 z-50">
				{navItems.slice(0, 4).map((item) => (
					<NavItem key={item.to} {...item} mobile />
				))}
				<button
					onClick={handleLogout}
					className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-red-400 hover:text-red-500 transition-colors"
				>
					<HiArrowRightOnRectangle className="text-xl" />
					<span className="text-[10px] font-bold uppercase tracking-wider">
						Exit
					</span>
				</button>
			</div>

			<div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 flex-col z-50">
				<div className="p-8 flex-1 overflow-y-auto custom-scrollbar min-h-0">
					<div className="mb-12">
						<Logo />
					</div>

					<div className="space-y-8">
						<div>
							<span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 mb-4 block">
								Main Menu
							</span>
							<nav className="space-y-1.5">
								{navItems.map((item) => (
									<NavItem key={item.to} {...item} />
								))}
							</nav>
						</div>
					</div>
				</div>

				<div className="p-8 border-t border-gray-50 bg-gray-50/30 shrink-0">
					<UserProfile user={user} />

					<button
						onClick={handleLogout}
						className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-300 group font-bold text-sm tracking-wide border border-transparent hover:border-red-100"
					>
						<div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
							<HiArrowRightOnRectangle className="text-xl" />
						</div>
						<span>Sign Out</span>
					</button>
				</div>
			</div>
		</>
	);
}
