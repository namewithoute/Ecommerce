var userModel = require('../models/userAccount')
var moment = require('moment')
const ACCOUNT_NOT_VERIFY = 0
const EMPTY_FIELD = 1
async function profileGET(req, res) {
    var user = await userModel.findOne({ email: req.data.email })
    var { dob, firstName, lastName, gender, phone, address, email, phone } = user
    var format = moment(dob).format('L')
    if (user.address.province.ID == null || user.address.district.ID == undefined || user.address.ward.ID == "" || user.address.specify == "" || user.phone == "") {
        res.locals.type = EMPTY_FIELD
        res.locals.message = "SOME FIELD ARE EMPTY, PLEASE ENTER YOUR INFORMATION"
        return res.render('profile', {
            user: {
                format, firstName, lastName, gender, phone, address, email, phone
            }
        })
    }
    if (!user.isVerify) {
        res.locals.type = ACCOUNT_NOT_VERIFY
        res.locals.message = "YOUR ACCOUNT IS NOT VERIFIED"
        return res.render('profile', {
            user: {
                format, firstName, lastName, gender, phone, address, email, phone
            }
        })
    }
    return res.render('profile', {
        user: {
            format, firstName, lastName, gender, phone, address, email, phone
        }
    })
}


async function profilePUT(req, res) {
    var { firstName, lastName, gender, dob, email, phone, province, district, ward, specify } = req.body.dataUpdate
    console.log(req.body.dataUpdate)
    console.log(phone)
    if(phone){
        var isValidPhone = await userModel.findOne({ phone: phone })
        if(isValidPhone){
            return res.json({ status: 0 ,message:'phone number used by another account'})
        }
    }
    try {
        var update = await userModel.findOneAndUpdate({ email: req.data.email }, { firstName, lastName, gender, dob, email, phone, address: { province, district, ward, specify },updateAt:new Date() }, { new: true, upsert: false })
        console.log(update)
        res.json({ status: 1 })
    }
    catch (e) {
        res.json({ status: 0 })
    }
}

module.exports = {
    profileGET,
    profilePUT
}