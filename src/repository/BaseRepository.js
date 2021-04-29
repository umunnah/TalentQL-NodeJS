class BaseRepository 
{
  constructor(model) {
    this.model = model;
  }

  async findAll() {
    return this.model.findAll();
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async findOne(data) {
    return this.model.findOne(data);
  }

  async create(body) {
    return this.model.create(body);
  }

  async findByIdAndDelete(id) {
    return this.model.findByIdAndDelete(id)
  }

  async findByIdAndUpdate(id, fieldsToUpdate) {
    return this.model.findByIdAndUpdate(id, fieldsToUpdate, {
      new: true,
      runValidators: true
    })
  }
}

module.exports = BaseRepository;