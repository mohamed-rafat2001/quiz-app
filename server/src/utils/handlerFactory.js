import errorHandling from "../middelwars/errorHandling.js";
import appError from "./appError.js";
import response from "./handelResponse.js";
import ApiFeatures from "./apiFeatures.js";

export const deleteOne = (Model) =>
	errorHandling(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc) {
			return next(new appError("No document found with that ID", 404));
		}

		response(null, 204, res);
	});

export const updateOne = (Model) =>
	errorHandling(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc) {
			return next(new appError("No document found with that ID", 404));
		}

		response(doc, 200, res);
	});

export const createOne = (Model) =>
	errorHandling(async (req, res, next) => {
		const doc = await Model.create(req.body);

		response(doc, 201, res);
	});

export const getOne = (Model, popOptions) =>
	errorHandling(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (popOptions) query = query.populate(popOptions);
		const doc = await query;

		if (!doc) {
			return next(new appError("No document found with that ID", 404));
		}

		response(doc, 200, res);
	});

export const getAll = (Model, filter = {}, popOptions) =>
	errorHandling(async (req, res, next) => {
		// To allow for nested get all in quizAnswer
		let combinedFilter = { ...filter };
		if (req.query) {
			// Extract query params that are not part of ApiFeatures
			const queryObj = { ...req.query };
			const excludedFields = ["page", "sort", "limit", "fields"];
			excludedFields.forEach((el) => delete queryObj[el]);
			combinedFilter = { ...combinedFilter, ...queryObj };
		}

		const features = new ApiFeatures(Model.find(combinedFilter), req.query)
			.filter()
			.sort()
			.limitFields();

		const total = await features.query.clone().countDocuments();

		features.paginate();

		if (popOptions) features.query = features.query.populate(popOptions);

		const docs = await features.query;

		const page = req.query.page * 1 || 1;
		const limit = req.query.limit * 1 || 100;

		response(docs, 200, res, { total, page, limit });
	});

export const deleteOneOwner = (Model, ownerField) =>
	errorHandling(async (req, res, next) => {
		const doc = await Model.findOneAndDelete({
			_id: req.params.id,
			[ownerField]: req.user._id,
		});

		if (!doc) {
			return next(
				new appError(
					"No document found with that ID or you are not the owner",
					404
				)
			);
		}

		response(null, 204, res);
	});

export const updateOneOwner = (Model, ownerField) =>
	errorHandling(async (req, res, next) => {
		const doc = await Model.findOneAndUpdate(
			{ _id: req.params.id, [ownerField]: req.user._id },
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!doc) {
			return next(
				new appError(
					"No document found with that ID or you are not the owner",
					404
				)
			);
		}

		response(doc, 200, res);
	});

export const getOneOwner = (Model, ownerField, popOptions) =>
	errorHandling(async (req, res, next) => {
		let query = Model.findOne({
			_id: req.params.id,
			[ownerField]: req.user._id,
		});
		if (popOptions) query = query.populate(popOptions);
		const doc = await query;

		if (!doc) {
			return next(
				new appError(
					"No document found with that ID or you are not the owner",
					404
				)
			);
		}

		response(doc, 200, res);
	});

export const getAllOwner = (Model, ownerField, popOptions) =>
	errorHandling(async (req, res, next) => {
		const features = new ApiFeatures(
			Model.find({ [ownerField]: req.user._id }),
			req.query
		)
			.filter()
			.sort()
			.limitFields();

		const total = await features.query.clone().countDocuments();

		features.paginate();

		if (popOptions) features.query = features.query.populate(popOptions);

		const docs = await features.query;

		const page = req.query.page * 1 || 1;
		const limit = req.query.limit * 1 || 100;

		response(docs, 200, res, { total, page, limit });
	});
