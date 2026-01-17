import BaseApi from "../../../shared/api/baseApi.js";

export async function signUp(data) {
	try {
		let user = await BaseApi.post("/user/sign-up", data);
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
export async function updateMe(data, onUploadProgress) {
	try {
		const isFormData = data instanceof FormData;
		let user = await BaseApi.patch("/user/me", data, {
			headers: isFormData
				? { "Content-Type": "multipart/form-data" }
				: undefined,
			onUploadProgress: (progressEvent) => {
				if (onUploadProgress && progressEvent.total) {
					const progress = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total
					);
					onUploadProgress(progress);
				}
			},
		});
		user = await user.data;
		return user.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function deleteMeImage() {
	try {
		let user = await BaseApi.delete("/user/me-image");
		user = await user.data;
		return user.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}
export async function getMe() {
	try {
		const response = await BaseApi.get("/user/me");
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
		let user = await BaseApi.patch("/user/update-password", data);
		user = await user.data;
		return user.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function forgotPassword(data) {
	try {
		const response = await BaseApi.post("/user/forget-password", data);
		return response.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}

export async function resetPassword(data) {
	try {
		const response = await BaseApi.post("/user/reset-password", data);
		return response.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
}
