import BaseApi from "../../../shared/api/baseApi";

export const getStats = async () => {
	const response = await BaseApi.get("/dashboard/stats");
	return response.data.data;
};

export const getTeacherQuizStats = async (params) => {
	const response = await BaseApi.get("/dashboard/teacher-quizzes", { params });
	return response.data;
};
