import { Outlet, useNavigation, Navigate } from "react-router-dom";
import SideBar from "./SideBar";
import Loader from "./Loader";
import { useUser } from "../../../features/auth/hooks/useAuth";

export default function AppLayout() {
	const navigation = useNavigation();
	const { data: user, isLoading: isUserLoading } = useUser();
	const isPageLoading = navigation.state === "loading";

	if (isUserLoading) return <Loader />;

	if (!user) {
		return <Navigate to="/welcome" replace />;
	}

	return (
		<div className="h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
			{isPageLoading && <Loader />}

			{/* Sidebar - Desktop is fixed, Mobile is top/bottom */}
			<div className="lg:w-64 flex-shrink-0">
				<SideBar />
			</div>

			{/* Main Content Area */}
			<main className="flex-1 min-w-0 overflow-y-auto pt-16 lg:pt-0 pb-16 lg:pb-0 scroll-smooth">
				<div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
