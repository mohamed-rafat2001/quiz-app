import BaseApi from "../../../shared/api/baseApi.js";

export async function startQuiz(data) {
	try {
		let quiz = await BaseApi.post("/teacher/startQuiz", data);
		quiz = await quiz.data;
		return quiz.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function getQuiz(ID) {
	try {
		let quiz = await BaseApi.get(`/teacher/quiz/${ID}`);
		quiz = await quiz.data;
		return quiz.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function getAllQuizzes() {
	try {
		let response = await BaseApi.get("/teacher/quiz/all");
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function createQuiz(data) {
	try {
		let response = await BaseApi.post("/teacher/quiz", data);
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function deleteQuiz(id) {
	try {
		let response = await BaseApi.delete(`/teacher/quiz/${id}`);
		return response.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function updateQuiz({ id, data }) {
	try {
		let response = await BaseApi.patch(`/teacher/quiz/${id}`, data);
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}
