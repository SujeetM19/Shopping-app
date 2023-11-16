const Products = require('../models/products')

const ErrorHandler = require('../utils/errorHandler');

const APIFeatures = require('./../utils/apiFeatures');
//create new product    =>     /api/v1/product/new


exports.newProduct = async(req, res, next) => {

    req.body.user = req.user.id;
    
    const product = await Products.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
}



//get all products => /api/v1/products?keyword=apple
exports.getProducts = async (req, res, next) =>{
    // console.log(req.query);
    const resPerPage = 4;

    const productCount = await Products.countDocuments();
    const apiFeatures = new APIFeatures(Products.find(), req.query)
                        .search()
                        .filter()
                        .pagination(resPerPage)

    const allProducts = await apiFeatures.query;

    res.status(200).json({
        success:true,
        numberOfProducts: allProducts.length,
        productCount,
        allProducts
    })
}

exports.getSingleProduct = async (req, res, next) => {
    try {
      const product = await Products.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
  
      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {

        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return next(new ErrorHandler("Product not found", 404));
        }


      console.error(error); 
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  

//update product => /api/v1/admin/product/:id   
exports.updateProduct = async(req, res, next) => {
    try{
        let product = await Products.findById(req.params.id);
        // console.log(product);
        if(!product){
            console.log(product)
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }

        product = await Products.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true,
            useFindAndModify:false
        });

        console.log(product.price);

        res.status(200).json({
            success:true,
            product
        })
    } catch(error){

        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false, 
                message: "Invalid product ID",
            }); 
            }
    
          console.error(error); 
          res.status(500).json({
            success: false,
            message: "Internal server error",
          });
    }

}
    
//delete product => /api/v1/admin/product/:id

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Products.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted"
        });
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false, 
                message: "Invalid product ID",
            }); 
        }
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the product"
        });
    }
};





// create new review  =>  /api/v1/review

exports.createProductReview = async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    // Checking if the user has already reviewed that product, then updating that review
    const product = await Products.findById(productId);

    const isReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        });
    }
    // For the user's first review (new review), push it in the reviews and do the same for rating
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Calculating overall rating
    product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
};



//get product reviews  => /api/v1/reviews

exports.getProductReviews = async(req, res, next) => {
    const product = await Products.findById(req.query.id);

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
}




//delete product reviews  => /api/v1/reviews

exports.deleteProductReviews = async(req, res, next) => {
    const product = await Products.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;
    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Products.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })


    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
}