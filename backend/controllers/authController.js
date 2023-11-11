const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');

exports.registerUser = async(req, res, next) => {
    const {name, email, password} = req.body; 

    const user = await User.create({
        name,
        email, 
        password,
        avatar: {
            public_id: 'drbikasm1/image/upload/v1698000157',
            url: 'https://res.cloudinary.com/drbikasm1/image/upload/v1698000157/pic_bcktdy.jpg'
        }
    })

    const token = user.getJwtToken();

    res.status(201).json({
        success:true,
        token
    })
}


// exports.loginUser = async(req, res, next) => {
//     const { email, password }  = req.body;

//     //checl if email and password is 
// }