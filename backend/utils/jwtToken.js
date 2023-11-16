//create and send token and save in the cookie.

const sendToken = (user, statusCode, res) => {

    //create Jwt token
    const token = user.getJwtToken();

    //optuins for cookie

    const options = {
        expires : new Date(
            Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })
}

module.exports = sendToken;
