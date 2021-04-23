const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
	first_name: {
		type: String,
		required: [true, 'Please first name is required'],
		maxlength: [10, 'First name can not be more than 10 characters']
	},
	last_name: {
		type: String,
		required: [true, 'Please last name is required'],
		maxlength: [10, 'Last name can not be more than 10 characters']
	},
	email: {
		type: String,
		required: [true, 'Please enter an email'],
		match: [
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		'Please enter a valid email'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please enter password'],
		minlength: 6,
		select: false,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	role: {
		type: String,
		required: [true, 'Please select a role'],
		enum:['user','admin'],
		default: 'user',
	},
	phone: {
		type: String,
	},
	photo: {
		type: String,
		default: 'no-photo.jpg'
	},
	createdAt: {
		type: Date,
		default: Date.now,
	}   
});

// Encrypt password
UserSchema.pre('save', async function(next) {
	if (!this.isModified('password')) {
		next();
	};
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({id: this._id},process.env.JWT_SECRET,{ expiresIn:process.env.JWT_EXPIRE})
}

// check if the password match
UserSchema.methods.matchPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
	// Generate token
	const resetToken = crypto.randomBytes(20).toString('hex');

	//Hash token and set reserPasswordToken field
	this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	// set reset password expire time
	this.resetPasswordExpire =  Date.now() + 12 * 60 * 60 * 1000;

	return resetToken;
}

module.exports = mongoose.model('User', UserSchema);