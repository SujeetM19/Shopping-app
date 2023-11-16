const User = require('../models/user');
const sendToken = require('../utils/jwtToken');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto');

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

    sendToken(user, 200, res)
}


exports.loginUser = async(req, res, next) => {
    const { email, password }  = req.body;

    //checl if email and password is entered  by user

    if(!email || !password) {
        return res.status(400).send({
            message: "Invalid email or password"
        });

    }

    //finding user in database

    const user = await User.findOne({email}).select('+password')

    if(!user){
        return res.status(400).send({
            message: "Invalid email or password"
        });
    }


    //checks if password is correct or not

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return res.status(400).send({
            message: "Invalid email or password"
        });
    }

    sendToken(user, 200, res)
}


//Forgot Password => /api/v1/password/forgot

exports.forgotPassword = async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email});

    if(!user){
        return res.status(404).send({
            message: "user not found with this email"
        });
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave : false})

    //create reset password url

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `your password reset token is as follows : \n\n ${resetUrl}\n\n If you have not requeseted it then ignore it.`

    try{

        await sendEmail({
            email: user.email,
            subject: 'Shopify Password Recovery',
            message
        })

        res.status(200).json({
            success:true,
            message: `Email sent to : ${user.email}`
        })

    } catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await  user.save({validateBeforeSave : false});

        return res.status(500).send({
            message: error.message
        });
    }


}



//reset password => /api/v1/password/reset/:token

exports.resetPassword = async(req, res, next) => {

    //hash url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken, 
        resetPasswordExpire: { $gt:Date.now() }
    })

    if(!user){
        return res.status(400).send({
            message: 'password reset token is invalid or expired'
        })
    }

    if(req.body.password !== req.body.confirmPassword){
        return res.status(400).send({
            message: 'password does not match'
        })
    }

    //setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res)

}



//get currently logged in uder details => /api/v1/me

exports.getUserProfile = async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true, 
        user
    })
}



//change / update password

exports.updatePassword = async(req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    //check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)

    if(!isMatched){
        return res.status(400).send({
            'message' : 'Old password is incorrect'
        })
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)
}


//update user profile => /api/v1/me/update

exports.updateProfile = async(req, res, next) => {
    const newUserData = {
        name : req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success: true
    })
}


//logout user => /api/v1/logout


exports.logout = async(req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
}



//admin  routes

//get all users =>  /api/v1/admin/users

exports.allUsers = async(req, res, next) => {
    const users = await User.find();
    console.log(users);
    res.status(200).json({
        status: true,
    })
}


//get user details  => /api/v1/admin/user/:id

exports.getUserDetails = async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return res.status(400).send({
            message : `User does not found with id :  ${req.params.id}` 
        })
    }

    res.status(200).json({
        success: true,
        user
    })
}


//admin : update user profile

//update user profile => /api/v1/admin/user/:id

exports.updateUser = async(req, res, next) => {
    const newUserData = {
        name : req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success: true
    })
}




//delete user  => /api/v1/admin/user/:id

exports.deleteUser = async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return res.status(400).send({
            message : `User does not found with id :  ${req.params.id}` 
        })
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
    })
}
