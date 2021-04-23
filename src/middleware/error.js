 const ErrorResponse = require('../utils/errorResponse');
 
 const errorHandler = (err, req, res, next) => {
	let error = {...err};
	
	error.message =  err.message;
	// Mongoose bad objectid
	 if ( err.name === "CastError") {
		 const message = `Resource not found with id ${err.value}`;
		 error = new ErrorResponse(message, 404);
	 }

	 if ( err.code === 11000) {
		 const message = 'Duplicate field entered';
		 error  =  new ErrorResponse(message, 404);
	 }

	 if ( err.name === 'ValidationError') {
		const message = Object.values(err.errors).map(err => err.message);
		error  =  new ErrorResponse(message, 422);
	}

	res.status(error.statusCode || 500 ).json({
			success:false, 
			message: error.message || 'Server error '
		});
 }

 module.exports = errorHandler;