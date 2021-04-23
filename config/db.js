const mongoose = require('mongoose');

const connectDB = async () => {

  const conn = await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser:true,
      useCreateIndex:true,
      useFindAndModify:false,
      useUnifiedTopology:true
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`)
				
      

}

const closeDB = async() => {
    return await mongoose.disconnect();
  }

module.exports = {connectDB, closeDB};