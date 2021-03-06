const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const errorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.authorization = asyncHandler(async (req, res, next) => {
	let token; 

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	} 
	else if (req.cookies.token) { 
		token = req.cookies.token
	}
	if (!token) {
		return next(new errorResponse('Not authorize to access this route', 401));
	}

	try {
		// verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id);
		next();
	} catch (err) {
		return next(new errorResponse('Not authorize to access this route', 401));
	}
});

