import axios from "axios";

const BaseApi = axios.create({
	baseURL: "http://localhost:8080/api",
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
