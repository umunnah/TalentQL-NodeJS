const mongoose = require('mongoose');

const connectDB = async() => {
    const  conn = await mongoose.connect(process.env.DATABASE_URI, {
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology:true
    });

}

module.exports = connectDB;