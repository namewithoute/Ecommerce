var jwt = require('jsonwebtoken')

var userModel = require('../models/userAccount')
require('dotenv').config()


function loginGET(req, res) {
    if(res.locals.flash) console.log(res.locals.flash)
    if (req.cookies.token) {
        return res.status(300).redirect('/profile')
    }
    res.render('login')
}

async function loginSSO(req, res) {
    var getTypeAccount=await userModel.findOne({email:req.user.emails[0].value})
    if(getTypeAccount && getTypeAccount.typeLogin=='normal'){
        req.session.flash={
            type:0,
            message:"EMAIL HAS BEEN USED BY OTHER ACCOUNT"
        }
        return res.redirect('/login')
    }
    console.log(req.user)
    var dob = req.user.dob.split('-')
    var formatDoB=`${dob[1]}-${dob[0]}-${dob[2]}`
    if(!getTypeAccount || !getTypeAccount.createAt){
        var user = await userModel.findOneAndUpdate({ email: req.user.emails[0].value }, {gender:req.user.gender,createAt:new Date(),dob:formatDoB, firstName: req.user._json.given_name,lastName:req.user._json.family_name,typeLogin:'sso' }, { new: true, upsert: true })
    }
    else{
    var user = await userModel.findOneAndUpdate({ email: req.user.emails[0].value }, {gender:req.user.gender,dob:formatDoB, firstName: req.user._json.given_name,lastName:req.user._json.family_name,typeLogin:'sso' }, { new: true, upsert: true })
    }
    var token = jwt.sign({
        user: {
            email: user.email,
            role: 1,
            isVerify: user.isVerify
        }
    }, process.env.SECRET_KEY)
    res.cookie('token', token)
    res.redirect('/profile')

}

async function loginPOST(req, res) {
    console.log(req.body.email)
    var userInfo = await userModel.findOne({ username: req.body.email, password: req.body.password })
    console.log(userInfo)
    if (userInfo) {
        var token = jwt.sign({
            user: {
                email: userInfo.email,
                role: userInfo.role,
                isVerify: userInfo.isVerify
            }
        }, process.env.SECRET_KEY)
        res.cookie('token', token)
        res.redirect('/')
        return
    }
    req.session.flash={
        type:0,
        message:"Wrong email or password"
    }
    return res.redirect('/login')

}

module.exports = {
    loginGET,
    loginPOST,
    loginSSO
}