import BaseApi from "../../../shared/api/baseApi.js";

export async function signUp(data) {
	try {
		let user = await BaseApi.post("/user/signUp", data);
		user = await user.data;
		return user.data;
	} catch (e) {
		throw new Error(e.response.data.message);
	}
}

export async function logout() {
	try {
		await BaseApi.get("/user/logout");
	} catch (e) {
		throw new Error(e.response.data.message);
	}
}

export async function login(data) {
	try {
		let user = await BaseApi.post("/user/login", data);
		user = await user.data;
		return user.data;
	} catch (e) {
		throw new Error(e.response.data.message);
	}
}
export async function updateMe(data) {
	try {
		let user = await BaseApi.patch("/user/Me", data);
		user = await user.data;
		return user.data;
	} catch (e) {
		throw new Error(e.response.data.message);
	}
}
export async function getMe(data) {
	try {
		let user = await BaseApi.get("/user/Me");
		user = await user.data;
		return user.data;
	} catch (e) {
		throw new Error(e.response.data.message);
	}
}
export async function updatePassword(data) {
	try {
		let user = await BaseApi.patch("/user/updatePassword", data);
		user = await user.data;
		console.log(user.data);
		return user.data;
	} catch (e) {
		throw new Error(e.response.data.message);
	}
}
