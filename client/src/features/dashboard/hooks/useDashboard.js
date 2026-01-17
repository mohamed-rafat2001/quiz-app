import { useQuery } from "@tanstack/react-query";
import { getStats, getTeacherQuizStats } from "../services/dashboardApi";

export const useStats = () => {
	return useQuery({
		queryKey: ["stats"],
		queryFn: getStats,
	});
};

export const useTeacherQuizStats = (params) => {
	return useQuery({
		queryKey: ["teacher-quiz-stats", params],
		queryFn: () => getTeacherQuizStats(params),
	});
};
