import BaseApi from "../api/baseApi.js";

export async function uploadImage(file) {
	try {
		const formData = new FormData();
		formData.append("image", file);

		const response = await BaseApi.post("/upload/image", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data.data;
	} catch (e) {
		throw new Error(e.response?.data?.message || "Failed to upload image");
	}
}

export async function deleteImage(public_id) {
	try {
		await BaseApi.delete("/upload/image", { data: { public_id } });
	} catch (e) {
		throw new Error(e.response?.data?.message || "Failed to delete image");
	}
}
