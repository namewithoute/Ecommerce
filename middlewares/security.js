var userModel = require('../models/userAccount')
async function changePassGET(req,res){
    var user = await userModel.findOne({email:req.data.email})
    if(user.typeLogin=='sso'){
        res.locals.type=0
        res.locals.message='YOUR ACCOUNT CANNOT USE THIS FUNCTION'
    }
    res.render('changePass',{display:'none'})
}

async function changePassPOST(req,res){
    var {oldPass,reTypePass,newPass}=req.body
    var user = await userModel.findOne({email:req.data.email})
    if(user.typeLogin=='sso'){
        // req.session.flash={
        //     type:0,
        //     message:'YOUR ACCOUNT CANNOT USE THIS FUNCTION'
        // }
        return res.redirect('/change-password')
    }
    var checkPass = await userModel.findOne({email:req.data.email,password:oldPass})
    if(!checkPass){
        req.session.flash={
            type:0,
            message:'OLD PASSWORD IS INCORRECT'
        }
        return res.redirect('/change-password')
    }

    await userModel.findOneAndUpdate({email:req.data.email},{password:newPass})
    res.redirect('/profile')


}
module.exports={changePassGET,changePassPOST}