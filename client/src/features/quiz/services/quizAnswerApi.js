import BaseApi from "../../../shared/api/baseApi.js";

export async function addAnswer({ questions, id }) {
	try {
		let answer = await BaseApi.post(`/answer/answer/${id}`, { questions });
		answer = await answer.data;
		return answer.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function getTeacherQuizAnswers(id, params) {
	try {
		let response = await BaseApi.get(`/answer/teacher-quiz-answers/${id}`, {
			params,
		});
		return response.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function getStudentQuizAnswers(params) {
	try {
		let response = await BaseApi.get("/answer/student-quiz-answers", {
			params,
		});
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function getQuizAnswer(id) {
	try {
		let response = await BaseApi.get(`/answer/quiz-answer/${id}`);
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function getResultDetails(id, params) {
	try {
		let response = await BaseApi.get(`/answer/result-details/${id}`, {
			params,
		});
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}
