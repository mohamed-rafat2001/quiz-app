import BaseApi from "../../../shared/api/baseApi.js";

export const getAllUsers = async (params) => {
	try {
		const response = await BaseApi.get("/user/allUsers/admin", { params });
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
};

export const deleteUser = async (id) => {
	try {
		await BaseApi.delete(`/user/admin/${id}`);
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
};

export const updateUser = async ({ id, data }) => {
	try {
		const response = await BaseApi.patch(`/user/admin/${id}`, data);
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
};

export const getAllQuizzes = async (params) => {
	try {
		const response = await BaseApi.get("/teacher/admin/all", { params });
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
};

export const deleteQuizByAdmin = async (id) => {
	try {
		await BaseApi.delete(`/teacher/admin/${id}`);
	} catch (e) {
		throw new Error(e.response?.data?.message || "Something went wrong");
	}
};
