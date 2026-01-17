export default function (model, code, res, meta) {
	const response = {
		status: "success",
		data: model,
	};
	if (meta) {
		response.meta = meta;
	}
	res.status(code).json(response);
}
