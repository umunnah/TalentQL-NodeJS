const User = require('../models/User');
const ErrorResponse =  require('../utils/errorResponse');
const asyncHandler =  require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');


// @desc create user
// @route POST /api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req,res,next) => {
	const {first_name, last_name,email, password, phone} = req.body;

    // Create User
	try {
		const user = await User.create({first_name,last_name,email,password,phone});
		await sendEmail({
			email: user.email,
			subject: 'Welcome to TalentQl',
			message: `${user.first_name} welcome to TalenQl social network`
		});
		// Authenticate, login the user and return the user token
    sendTokenResponse(user,201,res);
	} catch (e) {
		return next(new ErrorResponse(e, 422))
	}
	

    
});

// @desc login user
// @route POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req,res,next) => {
    const {email, password} = req.body;
    // Create User
    const user = await User.findOne({email}).select('+password');
    
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    //check if password match
    const isMatch =  await user.matchPassword(password); 

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401)); 
    }
		
    // User token
    sendTokenResponse(user,200,res);
});


// @desc Logout
// @route GET /api/v1/auth/logout
// @access Private
exports.logout = asyncHandler(async (req,res,next) => {
	res.cookie('token', 'none', {
		expire: new Date(Date.now() + 10 * 1000),
		httpOnly: true
	});
  res.status(200).json({success: true,data: {}});
});

// @desc User profile
// @route GET /api/v1/auth/profile
// @access Private
exports.profile = asyncHandler(async (req,res,next) => {
	const user = await User.findById(req.user.id);
	res.status(200).json({success: true,data: user}); 
});

//@desc  Forgot password
//@route PUT /api/v1/auth/forgot-password
//@accss Public
exports.forgotPassword = asyncHandler(async(req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
			return next(new ErrorResponse(`There is no user with this email ${req.body.email}`,422))
	}
	//Get reset token
	const resetToken = user.getResetPasswordToken();
	await user.save({ validateBeforeSave: false })

	const resetUrl = `${req.protocol}://${req.hostname}/${resetToken}`;

	const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to:\n\n ${resetUrl}`;

	try {
			await sendEmail({
					email: user.email,
					subject: 'Password reset token',
					message
			});
			res.status(200).json({
					success: true,
					data: 'Email sent'
			})
	} catch (err) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;
			await user.save({ validateBeforeSave: false });
			return next(new ErrorResponse(`Email could not be sent`, 500))
	}

});

// @desc User profile
// @route PUT /api/v1/auth/resetpassword/:resetpasswordtoken
// @access Public
exports.resetPassword = asyncHandler(async (req,res,next) => {

	const resetPasswordToken = crypto
	.createHash('sha256')
	.update(req.params.resetpasswordtoken)
	.digest('hex');

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt : Date.now()}
	});

	if (!user) {
		return next(new ErrorResponse('Invalid token', 400));
	}

	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

	await user.save();

	sendTokenResponse(user,200,res);
    
});

// get token and cookie
const sendTokenResponse = (user, statusCode, res) => {
	const token =  user.getSignedJwtToken();

	// using the jwt expire date for cookie expire date
	const expire =  process.env.JWT_EXPIRE;
	const cookieExpire =  expire.split('').splice(0,expire.length - 1).join('');
	
	const options = {
		expires: new Date(Date.now + parseInt(cookieExpire) * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	res.status(statusCode).cookie('token', token, options).json({
		success: true,
		token,
		firstname: user.firstname,
		image: user.image,
		lastname: user.lastname,
		email: user.email,
		id: user._id,
		role: user.role
	});
}