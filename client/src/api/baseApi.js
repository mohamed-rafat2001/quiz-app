import axios from "axios";
import { getToken } from "./localStorage";

const BaseApi = axios.create({
	baseURL: "http://127.0.0.1:8000/api",
});
BaseApi.interceptors.request.use((req) => {
	req.headers.Authorization = `Bearer ${getToken()}`;
	// console.log(req.cookies("jwt"));
	return req;
});
export default BaseApi;
