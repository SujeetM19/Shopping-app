const User = require("../models/user")
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");


//checks if user is authenticated or not

exports.isAuthenticatedUser = async(req, res, next) => {

    const {token} = req.cookies;  
    
    if(!token){
        return res.status(401).send({
            message: "Login first to access this resource"
        });
    }
     
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
}



//handeling user roles

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(400).json({
                message: `role ${req.user.role} is not allowed to access this resource`,
            })
        }

        next()
    }
}