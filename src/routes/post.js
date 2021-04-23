const express =  require('express');
const router = express.Router();
const { authorization} = require('../middleware/auth');
const PostController =  require('../controllers/post');
const advancedResults = require('../middleware/advancedResults');
const Post = require('../models/Post');
const upload = require("../utils/multer");

router.post('/post',authorization, upload.array("image"), PostController.createPost);

router.post('/post/:id',authorization, upload.array("image"), PostController.updatePost);

router.delete('/post/:id', authorization, PostController.deletePost);

router.route('/posts').get(advancedResults(Post,{
  path: "user",
  select: "title name"
}), PostController.getPosts);

router.get('/post/:id', PostController.getPost);



module.exports = router;