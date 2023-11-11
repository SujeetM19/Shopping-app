const products = require('../models/products');
const dotenv = require('dotenv');

const connectDatabase = require('../config/database');

const {connect} = require('mongoose');

dotenv.config({path : 'backend/config/config.env'});

const allProducts = require('../data/product');

connectDatabase();

const seedProducts = async () => {
    try{
        await products.deleteMany();
        console.log('products deleted');

        await products.insertMany(allProducts);
        console.log('products inserted');
        process.exit();
    }
    catch(err){
        console.log(err);
        process.exit()
    }
}

seedProducts();