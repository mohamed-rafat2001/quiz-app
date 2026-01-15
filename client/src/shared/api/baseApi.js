import axios from "axios";

const BaseApi = axios.create({
	baseURL: "http://localhost:8000/api",
	withCredentials: true,
});

export default BaseApi;
