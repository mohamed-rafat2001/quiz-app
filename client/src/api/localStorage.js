export const storeToken = (value) => {
	if (!JSON.parse(localStorage.getItem("token"))) {
		const token = localStorage.setItem("token", JSON.stringify(value));
		return token;
	}
};
export const getToken = () => {
	const token = JSON.parse(localStorage.getItem("token"));
	return token;
};
export const removeToken = () => {
	if (JSON.parse(localStorage.getItem("token"))) {
		const token = localStorage.removeItem("token");
		return token;
	}
};
