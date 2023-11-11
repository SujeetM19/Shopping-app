const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, 'please enter your name'],
        maxlength:[30, 'your name cannot exceed 30 characters'],
    },

    email:{
        type:String,
        required: [true, 'please enter your email'],
        unique:true,
        validate: [validator.isEmail, 'Please enter a valid email address'],
    },

    password:{
        type:String,
        required: [true, 'please enter your password'],
        minlength:[6, 'your password must be longer than 6 characters'],

        select:false, //we dont want to show the password of the user
    },
    avatar : {
        public_id: {
                type: String,
                required: true
            },
            url: {
                required: true,
                type: String,
            }
    },
    
    role: {
        type: String,
        default: 'user'
    },

    createdAt: {
        type:Date,
        default: Date.now
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date

})


//encrypting password for ssaving

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10)
})


userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
         expiresIn:process.env.JWT_EXPIRE_TIME 
    }     
    )
}

module.exports = mongoose.model('User', userSchema);

