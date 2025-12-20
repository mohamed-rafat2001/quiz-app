import BaseApi from "../api/baseApi.js";
export async function startQuiz(data) {
	try {
		console.log(data);
		let quiz = await BaseApi.post("/teacher/startQuiz", data);
		quiz = await quiz.data;
		return quiz.data;
	} catch (e) {
		throw new Error(e.response.data.message);
	}
}

export async function getQuiz(ID) {
	try {
		let quiz = await BaseApi.get(`/teacher/quiz/${ID}`);
		quiz = await quiz.data;
		return quiz.data;
	} catch (e) {
		throw new Error(e.response.data.message);
	}
}
