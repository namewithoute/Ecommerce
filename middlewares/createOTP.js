var otpModel = require('../models/otp')
var sendSMS=require('../service/sendSMS')
var userModel = require('../models/userAccount')
module.exports=async function(req,res){
    var otp = Math.floor((Math.random()*(0.9-0.1)+0.1)*1000000)
    console.log(otp +' created')
    var userInfo=await userModel.findOne({email:req.data.email})
    await otpModel.findOneAndUpdate({email:req.data.email},{otp:otp},{upsert:true})
    await sendSMS({phone:userInfo.phone,otp})

    res.status(200).json({status:1,message:'ok'})
}