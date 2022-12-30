var userAccount=require('../models/userAccount')
var jwt =require('jsonwebtoken')
require('dotenv').config()
function adminLoginGET(req,res){
    if(!req.cookies.tokenAdmin)
    res.render('loginAdmin')
    else
    res.redirect('/admin/dashboard')
}

async function adminLoginPOST(req,res){
    var admin = await userAccount.findOne({email:req.body.email,password:req.body.password})
    console.log(admin)
    if(admin && admin.role>1){
        var token = jwt.sign({email:admin.email,role:admin.role},process.env.ADMIN_SECRET)
        res.clearCookie("token")

        res.cookie('tokenAdmin',token)
        // return res.json(token)
        return res.redirect('/admin/dashboard')
    }
    req.session.flash={
        type:0,
        message:'INVALID ACCOUNT, PLEASE TRY AGAIN'
    }
    res.redirect('/admin/login')
}


 module.exports={
    adminLoginGET,adminLoginPOST
 }