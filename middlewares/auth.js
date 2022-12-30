var jwt = require('jsonwebtoken')
const userModel = require('../models/userAccount')
require('dotenv').config()


async function authenticate(req, res, next) {
    try {
        var decoded = await jwt.verify(req.cookies.token, process.env.SECRET_KEY)
        var userInfo = await userModel.findOne({ email: decoded.user.email })
        if (userInfo.status == false) {
            res.clearCookie("token")
            req.session.flash={
                type:0,
                message:"Your account has been locked, please contact to 19002541 to complain"
            }
            return res.redirect('/login')
        }
        req.data = decoded.user
        next()
    }
    catch (e) {
        if (req.originalUrl == '/cart' && req.method == "POST") {
            return res.status(408).json({ err: 1, message: 'Login is require' })
        }
        else {
            res.redirect('/login')
        }
    }
}

module.exports = authenticate