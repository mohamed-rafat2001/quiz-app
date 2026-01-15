import axios from "axios";

const API_URL = "http://localhost:8000/api/dashboard";

export const getStats = async () => {
	const response = await axios.get(`${API_URL}/stats`, {
		withCredentials: true,
	});
	return response.data.data;
};
