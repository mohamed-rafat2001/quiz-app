import BaseApi from "../../../shared/api/baseApi.js";

export async function addAnswer({ questions, id }) {
	try {
		let answer = await BaseApi.post(`/quiz/answer/${id}`, { questions });
		answer = await answer.data;
		return answer.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function getTeacherQuizAnswers(id) {
	try {
		let response = await BaseApi.get(`/quiz/teacher-quiz-answers/${id}`);
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function getStudentQuizAnswers() {
	try {
		let response = await BaseApi.get("/quiz/student-quiz-answers");
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function getQuizAnswer(id) {
	try {
		let response = await BaseApi.get(`/quiz/quiz-answer/${id}`);
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function getResultDetails(id) {
	try {
		let response = await BaseApi.get(`/quiz/result-details/${id}`);
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}
