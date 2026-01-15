import BaseApi from "../../../shared/api/baseApi.js";

export async function signUp(data) {
	try {
		let user = await BaseApi.post("/user/signUp", data);
		user = await user.data;
		return user.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function logout() {
	try {
		await BaseApi.get("/user/logout");
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function login(data) {
	try {
		let user = await BaseApi.post("/user/login", data);
		user = await user.data;
		return user.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}
export async function updateMe(data) {
	try {
		let user = await BaseApi.patch("/user/Me", data);
		user = await user.data;
		return user.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}
export async function getMe() {
	try {
		const response = await BaseApi.get("/user/Me");
		return response.data.data;
	} catch (e) {
		if (e.response?.status === 401) {
			return null;
		}
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}
export async function updatePassword(data) {
	try {
		let user = await BaseApi.patch("/user/updatePassword", data);
		user = await user.data;
		return user.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}
