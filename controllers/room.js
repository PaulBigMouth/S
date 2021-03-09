const Student = require('../models/Student');
const Room = require('../models/Room');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async function (req, res) {
	const query = {
		user: req.user._id,
	};

	if (req.query.number) {
		query.number = req.query.number
	}

	if (req.query.maxQuantity) {
		query.maxQuantity = req.query.maxQuantity
	}

	if (req.query.freeQuantity) {
		query.freeQuantity = req.query.freeQuantity
	}
	console.log('hello');




	try {
		const rooms = await Room.find(query).skip(+req.query.offset).limit(+req.query.limit);
		res.status(200).json(rooms);
	} catch (error) {
		errorHandler(res, error);
	}
};

module.exports.getById = async function (req, res) {
	try {
		const room = await Room.findById(req.params.id);
		const students = await Student.find({ _id: { $in: room.students } })
		res.status(200).json({
			room,
			students
		});
	} catch (error) {
		errorHandler(res, error);
	}
};

module.exports.remove = async function (req, res) {
	try {
		await Room.remove({ _id: req.params.id })
		res.status(200).json({
			message: 'Комната была удалена',
		});
	} catch (error) {
		errorHandler(res, error);
	}
};

module.exports.create = async function (req, res) {
	const candidate = await Room.findOne({
		number: req.body.number
	})
	if (candidate) {
		res.status(400).json({
			message: 'Такая комната уже есть'
		})
	} else {
		const room = new Room({
			maxQuantity: req.body.maxQuantity,
			number: req.body.number,
			students: req.body.students,
			user: req.user._id,
			freeQuantity: req.body.maxQuantity - req.body.students?.length || 0
		});

		try {
			await room.save();
			res.status(201).json(room);
		} catch (error) {
			errorHandler(res, error);
		}
	}

};

module.exports.update = async function (req, res) {
	const updated = {
		number: req.body.number,
		maxQuantity: req.body.maxQuantity,
		students: req.body.students,
		freeQuantity: req.body.maxQuantity - req.body.students?.length || 0
	};

	try {
		const room = await Room.findByIdAndUpdate({ _id: req.params.id }, { $set: updated }, { new: true });
		res.status(200).json(room);
	} catch (error) {
		errorHandler(res, error);
	}
};
