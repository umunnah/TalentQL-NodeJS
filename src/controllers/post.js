const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const fs = require("fs");
const cloudinary = require('../utils/upload');
let PostRepository = require('../repository/PostRepository');


//@desc Get all posts
//@route GET /api/v1/posts
//@accss Public
exports.getPosts = asyncHandler(async(req, res, next) => {
  const result = res.advancedResults;
  res.status(200).json({success:true,data: result});
});

//@desc Get single posts
//@route GET /api/v1/posts/:id
//@accss Public
exports.getPost = asyncHandler(async(req, res, next) => {
    // const post = await Post.findById(req.params.id).populate('user');
		const post = await PostRepository.findById(req.params.id);
    res.status(200).json({ success: true, data: post });
});



//@desc  Create new post
//@route POST /api/v1/posts
//@accss Private
exports.createPost = asyncHandler(async(req, res, next) => {
	req.body.user = req.user.id;
	try {
			let urls = [];
			if (req.files) {
				const files = req.files
				let multiple = async(path) => await new cloudinary(path).upload();
				for (const file of files) {
						const { path } = file;
						const newPath = await multiple(path);
						urls.push(newPath);
						fs.unlinkSync(path);
				}
				req.body.image = urls;
			}
			const post = await PostRepository.create(req.body);
			res.status(201).json({ success: true, data: post });
		} catch (e) {
			return next(new ErrorResponse(e, 422));
		}
});

//@desc  Update post
//@route POST /api/v1/post/:id
//@accss Private
exports.updatePost = asyncHandler(async(req, res, next) => {
	req.body.user = req.user.id;
	const post = await PostRepository.findById(req.params.id);
	
	if (post.user != req.user.id) return next(new ErrorResponse("Not Authorized", 403));

	let fieldsToUpdate = {
		title: req.body.title,
		content : req.body.content
	};

	try {
			let urls = [];
			if (req.files && req.files.length > 0) {
				const files = req.files
				let multiple = async(path) => await new cloudinary(path).upload();
				for (const file of files) {
						const { path } = file;
						const newPath = await multiple(path);
						post.image.push(newPath);
						fs.unlinkSync(path);
				}
				fieldsToUpdate.image = post.image;	
			}
			let updatedPost = await PostRepository.findByIdAndUpdate(req.params.id, fieldsToUpdate);
			res.status(200).json({ success: true, data: updatedPost });
		} catch (e) {
			return next(new ErrorResponse(e, 400));
		}
});

//@desc  Delete post
//@route DELETE /api/v1/post/:id
//@accss Private
exports.deletePost = asyncHandler(async(req, res, next) => {
    const checkPost = await PostRepository.findById(req.params.id);
    if (checkPost.user != req.user.id) return next(new ErrorResponse("Not Authorized", 403));
		try {
			const post = await PostRepository.findByIdAndDelete(req.params.id)
      res.status(200).json({ success: true, data: "Post Successfully deleted" });
		} catch (e) {
			return next(new ErrorResponse(e, 400));
		}
});