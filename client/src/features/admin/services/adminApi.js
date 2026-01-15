import axios from "axios";

const USER_API = "http://localhost:8000/api/user";
const QUIZ_API = "http://localhost:8000/api/teacher";

export const getAllUsers = async () => {
	const response = await axios.get(`${USER_API}/allUsers/admin`, {
		withCredentials: true,
	});
	return response.data.data;
};

export const deleteUser = async (id) => {
	await axios.delete(`${USER_API}/admin/${id}`, {
		withCredentials: true,
	});
};

export const updateUser = async ({ id, data }) => {
	const response = await axios.patch(`${USER_API}/admin/${id}`, data, {
		withCredentials: true,
	});
	return response.data.data;
};

export const getAllQuizzes = async () => {
	const response = await axios.get(`${QUIZ_API}/admin/all`, {
		withCredentials: true,
	});
	return response.data.data;
};

export const deleteQuizByAdmin = async (id) => {
	await axios.delete(`${QUIZ_API}/admin/${id}`, {
		withCredentials: true,
	});
};
