import axios from "axios";

const BaseApi = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});

// Add a response interceptor to handle errors globally
BaseApi.interceptors.response.use(
	(response) => response,
	(error) => {
		// Handle 401 errors globally if needed
		if (error.response?.status === 401) {
			// e.g., redirect to login if not on an public page
		}

		return Promise.reject(error);
	}
);

export default BaseApi;
