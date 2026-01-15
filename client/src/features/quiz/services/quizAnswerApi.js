import BaseApi from "../../../shared/api/baseApi.js";

export async function addAnswer({ questions, id }) {
	try {
		let answer = await BaseApi.post(`/quiz/answer/${id}`, { questions });
		answer = await answer.data;
		return answer.data;
	} catch (e) {
		throw new Error(e.response.data.message);
	}
}

export async function getTeacherQuizAnswers(id) {
	try {
		let response = await BaseApi.get(`/quiz/teacherQuizAnswers/${id}`);
		return response.data.data;
	} catch (e) {
		throw new Error(e.response.data.message);
	}
}

export async function getStudentQuizAnswers() {
	try {
		let response = await BaseApi.get("/quiz/studentquizAnswers");
		return response.data.data;
	} catch (e) {
		throw new Error(e.response.data.message);
	}
}

export async function getQuizAnswer(id) {
	try {
		let response = await BaseApi.get(`/quiz/quizAnswer/${id}`);
		return response.data.data;
	} catch (e) {
		throw new Error(e.response.data.message);
	}
}

export async function getResultDetails(id) {
	try {
		let response = await BaseApi.get(`/quiz/resultDetails/${id}`);
		return response.data.data;
	} catch (e) {
		throw new Error(e.response.data.message);
	}
}
