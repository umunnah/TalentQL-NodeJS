const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Please title is required'],
    trim: true,
    maxlength: [100, "Name can not be more than 100 characters"],
	},
	content: {
		type: String,
		required: [true, 'Please content is required'],
	},
  image: {
    type: []
  },
  user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
  },
	createdAt: {
		type: Date,
		default: Date.now,
	}   
});


module.exports = mongoose.model('Post', PostSchema);