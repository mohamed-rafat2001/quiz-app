import { useState, useEffect, lazy, Suspense } from "react";
import { useStats, useTeacherQuizStats } from "../hooks/useDashboard";
import { useUser } from "../../auth/hooks/useAuth";
import Loader from "../../../shared/components/ui/Loader";
import WelcomeHeader from "./WelcomeHeader";

const AdminDashboard = lazy(() => import("./AdminDashboard"));
const TeacherDashboard = lazy(() => import("./TeacherDashboard"));
const StudentDashboard = lazy(() => import("./StudentDashboard"));

const DashBoard = () => {
	const { data: user } = useUser();
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [page, setPage] = useState(1);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchTerm);
			setPage(1);
		}, 500);
		return () => clearTimeout(timer);
	}, [searchTerm]);

	const { data: stats, isLoading, isError } = useStats();

	const { data: response, isLoading: isLoadingQuizzes } = useTeacherQuizStats(
		{
			keyword: debouncedSearch,
			page,
			limit: 5,
		},
		{
			enabled: user?.role === "teacher",
		}
	);

	const teacherQuizzes = response?.data || [];
	const meta = response?.meta || {};

	if (isError) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<WelcomeHeader user={user} role={user?.role} />
				<div className="flex flex-col items-center justify-center min-h-[400px] mt-8 space-y-4 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
					<div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-2xl mb-2">
						⚠️
					</div>
					<p className="text-gray-900 dark:text-white font-bold text-xl">Something went wrong</p>
					<p className="text-gray-500 dark:text-gray-400">Failed to load dashboard statistics.</p>
					<button
						onClick={() => window.location.reload()}
						className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-200 dark:shadow-none"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<WelcomeHeader user={user} role={user?.role} />

			<div className="mt-8">
				{isLoading ? (
					<div className="flex items-center justify-center min-h-[400px]">
						<Loader />
					</div>
				) : (
					<Suspense
						fallback={
							<div className="flex items-center justify-center min-h-[400px]">
								<Loader />
							</div>
						}
					>
						{user?.role === "admin" && <AdminDashboard stats={stats} />}
						{user?.role === "teacher" && (
							<TeacherDashboard
								stats={stats}
								quizzes={teacherQuizzes}
								isLoadingQuizzes={isLoadingQuizzes}
								searchTerm={searchTerm}
								onSearchChange={setSearchTerm}
								page={page}
								onPageChange={setPage}
								meta={meta}
							/>
						)}
						{user?.role === "student" && <StudentDashboard stats={stats} />}
					</Suspense>
				)}
			</div>
		</div>
	);
};

export default DashBoard;
