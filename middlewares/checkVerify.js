var userModel = require('../models/userAccount')

async function checkVerify(req, res, next) {
    var userInfo = await userModel.findOne({ email: req.data.email })
    if (!userInfo.isVerify) {
        return res.redirect('/profile')
    }
    next()
}

async function checkInfor(req, res, next) {
    var userInfo = await userModel.findOne({ email: req.data.email })
    if (!(userInfo.address || userInfo.address.province || userInfo.address.district || userInfo.address.ward || userInfo.address.specify)) {
        return res.redirect('/profile')
    }
    next()
}

module.exports={
    checkVerify,checkInfor
}