const dotenv = require('dotenv');
dotenv.config({path : './.env'});
const app = require('./src/app');
const {connectDB} = require('./config/db');


//connect to database
connectDB();


const PORT = process.env.PORT || 8000
const server  = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));

//Handle promise rejection

process.on('unhandledRejection', (err,promise) => {
  console.log(`Error: ${err.message}`)
	server.close(() => process.exit(1));
});

