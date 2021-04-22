const express =  require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const morgan =  require('morgan');
const multer = require('multer');


// dotenv.config({path : './config/config.env'});

const app = express();

// Body parser
app.use(express.json());

// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({extended: true}));

// for parsing multipart/form-data
// Middleware to upload files
const upload = multer();
app.use(upload.array()); 


// Cookie parser
app.use(cookieParser());

// Dev logger middleware
(process.env.NODE_ENV === 'development') ? app.use(morgan('dev')) : '';


// Sanitize data to prevent NoSql injection
// app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xssClean());

// Prevent http param pollution
app.use(hpp());


// app.use(errorHandler);

const PORT = process.env.PORT || 5000

const server  = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));

//Handle promise rejection

process.on('unhandledRejection', (err,promise) => {
	server.close(() => process.exit(1));
});
