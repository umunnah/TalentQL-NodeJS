const Post = require('../models/Post');
const BaseRepository = require('./BaseRepository');

class PostRepository extends BaseRepository 
{
  constructor() {
    super(Post);
  }
}

module.exports = new PostRepository();