const ErrorHandler = require('./../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    
    if (!err.message || err.message.trim() === '') {
        err.message = 'Internal Server Error';
      }

    console.log("Error object:", err);
    
    res.status(err.statusCode).json({
        success: false,
        error: err.message
    })
}