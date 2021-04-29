const User = require('../models/User');
const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository 
{
  constructor() {
    super(User);
  }

  async findOneWithSelect(data) {
    return User.findOne(data).select('+password');
  }
}

module.exports = new UserRepository();