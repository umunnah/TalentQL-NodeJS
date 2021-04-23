const express =  require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const morgan =  require('morgan');
const multer = require('multer');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const errorHandler = require('./middleware/error');

// All Routes files
const auth = require('./routes/auth');


const app = express();


//
app.use(cors());

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
// Only run on development enviroment
(process.env.NODE_ENV === 'development') ? app.use(morgan('dev')) : '';


// Sanitize data to prevent NoSql injection
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xssClean());

// Prevent http param pollution
app.use(hpp());

// Mount imported routers
app.use('/api/v1/auth', auth);


app.use(errorHandler);

module.exports = app;
