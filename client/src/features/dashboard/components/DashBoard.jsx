import { useState, useEffect } from "react";
import { useStats, useTeacherQuizStats } from "../hooks/useDashboard";
import { useUser } from "../../auth/hooks/useAuth";
import Loader from "../../../shared/components/ui/Loader";
import WelcomeHeader from "./WelcomeHeader";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";

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

	if (isLoading) {
		return <Loader />;
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<p className="text-red-500 font-bold">Failed to load dashboard statistics.</p>
				<button 
					onClick={() => window.location.reload()}
					className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<WelcomeHeader user={user} role={user?.role} />

			<div className="mt-8">
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
			</div>
		</div>
	);
};

export default DashBoard;
