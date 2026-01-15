import { Suspense } from "react";
import { Outlet, useNavigation, Navigate } from "react-router-dom";
import SideBar, { UserProfile } from "./SideBar";
import Loader from "./Loader";
import { useUser, useLogout } from "../../../features/auth/hooks/useAuth";
import { HiArrowRightOnRectangle } from "react-icons/hi2";

export default function AppLayout() {
	const navigation = useNavigation();
	const { data: user, isLoading: isUserLoading } = useUser();
	const logout = useLogout();
	const isPageLoading = navigation.state === "loading";

	if (isUserLoading) return <Loader />;

	if (!user) {
		return <Navigate to="/welcome" replace />;
	}

	const handleLogout = () => logout();

	return (
		<div className="h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
			{isPageLoading && <Loader />}

			{/* Sidebar - Desktop is fixed, Mobile is top/bottom */}
			<div className="lg:w-72 shrink-0">
				<SideBar />
			</div>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Desktop Header */}
				<header className="hidden lg:flex h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 items-center justify-end px-12 shrink-0 z-40">
					<div className="flex items-center gap-6">
						<UserProfile user={user} />
						<div className="w-px h-8 bg-gray-100" />
						<button
							onClick={handleLogout}
							className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 font-bold text-sm"
						>
							<HiArrowRightOnRectangle className="text-xl" />
							<span>Sign Out</span>
						</button>
					</div>
				</header>

				<main className="flex-1 overflow-y-auto pt-20 lg:pt-0 pb-20 lg:pb-0 scroll-smooth">
					<div className="max-w-7xl mx-auto p-4 sm:p-8 lg:p-12">
						<Suspense fallback={<Loader />}>
							<Outlet />
						</Suspense>
					</div>
				</main>
			</div>
		</div>
	);
}
