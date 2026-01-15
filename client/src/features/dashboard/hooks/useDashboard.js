import { useQuery } from "@tanstack/react-query";
import { getStats } from "../services/dashboardApi";

export const useStats = () => {
	return useQuery({
		queryKey: ["stats"],
		queryFn: getStats,
	});
};
