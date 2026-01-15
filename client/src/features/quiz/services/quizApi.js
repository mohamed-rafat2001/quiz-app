import BaseApi from "../../../shared/api/baseApi.js";

export async function startQuiz(data) {
	try {
		let quiz = await BaseApi.post("/teacher/start-quiz", data);
		quiz = await quiz.data;
		return quiz.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function getQuiz(ID) {
	try {
		let quiz = await BaseApi.get(`/teacher/quizzes/${ID}`);
		quiz = await quiz.data;
		return quiz.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function getAllQuizzes(params) {
	try {
		let response = await BaseApi.get("/teacher/all-quizzes", { params });
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function createQuiz(data) {
	try {
		let response = await BaseApi.post("/teacher/quizzes", data);
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function deleteQuiz(id) {
	try {
		let response = await BaseApi.delete(`/teacher/quizzes/${id}`);
		return response.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function updateQuiz({ id, data }) {
	try {
		let response = await BaseApi.patch(`/teacher/quizzes/${id}`, data);
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}
