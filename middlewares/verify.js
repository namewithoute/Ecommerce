var userModel=require('../models/userAccount')
var sendSMS = require('../service/sendSMS')
var otpModel = require('../models/otp')
async function verifyGET(req,res){
    var userInfo = await userModel.findOne({email:req.data.email})
    if(userInfo.isVerify){
        return res.redirect('/profile')
    }
    res.render('verify')
}

async function verifyPOST(req,res){
    var verify = await otpModel.findOne({email:req.data.email,otp:req.body.otp})
    if(verify){
        await userModel.updateOne({email:req.data.email},{isVerify:true,updateAt:new Date()})
        res.locals.type=2
        res.locals.message = "VERIFY YOUR ACCOUNT SUCCESSFULY"
        return res.json({status:1})
        }
        res.json({status:0})
}

module.exports={
    verifyGET,verifyPOST
}