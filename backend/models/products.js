const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Please name cannot exceede 100 characters']
    },
    price:{
        type : String,
        required: [true, 'Please enter product price'],
        default: '0.0'
    },
    
    description : {
        type : String,
        required: [true, 'Please enter product description'],
    },

    ratings : {
        type : Number,
        default: 0
    },

    images : [
        {
            public_id : {
                type : String,
                required: [true]
            },

            url : {
                type : String,
                required: [true]
            }
        }
    ],

    category : {
        type : String,
        required: [true, 'Please select a category for this product'],
        enum : {
            values: [
                'Electronics',
                'Camera',
                'Laptops',
                'Mobile',
                'Headphones',
                'Accessories',
                'Cameras',
                'Food',
                'Books',
                'Sports',
                'Clothes',
                'Home',
                'Beauty',
                'Others'
            ],
            message: 'Please select the correct category'
        }

    },

    seller: {
        type: String,
        required: [true, 'Please select a seller for this product'],
        
    },

    stock:{
        type:Number,
        required: [true, 'Please enter stock'],
        maxLength: [5, 'Product stock cannot exceed 5 characters'],
        default: 0
    },

    numOfReviews:{
        type:Number,
        default: 0
    },

    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId, 
                ref: 'User',
                required: true
            },
            
            name:{
                type:String,
                required: [true]
            },
            rating:{
                type:Number,
                required: [true]
            },
            comment:{
                type:String,
                required: [true]
            }
        }
    ],

    user: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }



})

module.exports = mongoose.model('products', productSchema)