const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async function(req, res) {
	const query = {
		user: req.user._id,
	};
	// Дата старта
	if (req.query.start) {
		query.date = {
			//$gte - больше или равно
			$gte: req.query.start,
		};
	}

	if (req.query.end) {
		if (!query.date) {
			query.date = {};
		}
		//$lte - меньше или
		query.date['$lte'] = req.query.end;
	}

	if (req.query.order) {
		query.order = +req.query.order;
	}

	try {
		const orders = await Order.find(query).sort({ date: -1 }).skip(+req.query.offset).limit(+req.query.limit);
		// (get) localhost:5000/api/order?offset=28limit=5

		res.status(200).json(orders);
	} catch (error) {
		errorHandler(res, error);
	}
};

module.exports.create = async function(req, res) {
	try {
		const lastOrder = await Order.findOne({ user: req.user._id }).sort({ date: -1 });

		const maxOrder = lastOrder ? lastOrder.order : 0;
		console.log(lastOrder, req.user);
		const order = await new Order({
			list: req.body.list,
			user: req.user._id,
			order: maxOrder + 1,
		}).save();

		res.status(201).json(order);
	} catch (error) {
		errorHandler(res, error);
	}
};
