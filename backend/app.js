const express = require('express');

const app = express();

const errorMiddleware = require('./middlewares/errors');

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const fileUpload = require('express-fileupload')

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());
app.use(fileUpload());

//setting up cloudinary config


//import all routes

const products = require('./routes/products');
const auth = require('./routes/auth');
const order = require('./routes/order');

app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', order)



//Middleware to handle errors

app.use(errorMiddleware);

module.exports = app;
