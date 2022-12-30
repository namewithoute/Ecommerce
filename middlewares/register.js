const {validationResult } = require('express-validator');
var userModel=require('../models/userAccount')

function registerGET(req,res){
    res.render('register')
}

async function registerPOST(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.flash={
            type:0,
            message:"Invalid infor"
        }
      return res.redirect('/register');
    }
    var user =await userModel.findOne({$or:[{email:req.body.email},{phone:req.body.phone}]})
    if(user){
        req.session.flash={
            type:0,
            message:"Email existed"
        }
        return res.redirect('/register')
    }
    new userModel({
        email:req.body.email,
        password:req.body.password,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        phone:req.body.phone,
        role:1,
        typeLogin:'normal',
        gender:req.body.gender,
        dob:req.body.dob,
        createAt:Date.now(),
    }).save()
    res.redirect('/login')

}

module.exports={
    registerGET,registerPOST
}