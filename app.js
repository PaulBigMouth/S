const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const keys = require('./config/keys');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');

const app = express();

mongoose
	.connect(keys.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('mongoDB connected'))
	.catch((e) => console.log(e));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(require('morgan')('dev'));
app.use('/uploads', express.static('uploads'));
app.use(require('cors')());
app.use(
	bodyParser.urlencoded({
		extended: true,
	}),
);
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

app.use('/api/analytics', analyticsRoutes);

app.use('/api/category', categoryRoutes);

app.use('/api/order', orderRoutes);

app.use('/api/position', positionRoutes);

module.exports = app;
