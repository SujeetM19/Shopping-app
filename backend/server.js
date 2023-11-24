const app = require('./app');
const connectDatabase = require('./config/database.js')

const dotenv = require('dotenv');

const cloudinary = require('cloudinary')


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//setting up config file

dotenv.config({path: 'backend/config/config.env'});


//connecting to database

connectDatabase();

app.listen(process.env.PORT, () => {
    console.log(`server is listening on port : ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})

// console.log("Hello");