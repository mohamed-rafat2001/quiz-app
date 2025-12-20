import BaseApi from "../api/baseApi.js";
export async function addAnswer({ questions, id }) {
	try {
		let answer = await BaseApi.post(`/quiz/asnwer/${id}`, { questions });
		answer = await answer.data;
		return answer.data;
	} catch (e) {
		throw new Error(e.response.data.message);
	}
}
