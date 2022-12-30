var jwt = require('jsonwebtoken')
const userModel=require('../models/userAccount')
require('dotenv').config()
async function authSuperAdmin(req, res, next) {
    var token = req.cookies.tokenAdmin
    if (!token) {
        return res.redirect('/admin/login')
    }
    try {
        var isAdmin = jwt.verify(token, process.env.ADMIN_SECRET)
        console.log(isAdmin)
        var adminInfo = await userModel.findOne({email:isAdmin.email})
        if(adminInfo.status==false){
            req.session.flash={
                type:0,
                message:"Your account has been locked, please contact to 19002541 to complain"
            }
            return res.redirect('/admin/login')
        }
    }
    catch (e) {
        return res.redirect('/admin/login')
    }

    if ( isAdmin.role == 4) {
        next()
    }
    else {
        res.redirect('/admin/warehouse')
    }

}

async function authWarehouse(req, res, next) {
    var token = req.cookies.tokenAdmin
    try {
        var isAdmin = jwt.verify(token, process.env.ADMIN_SECRET)
        var adminInfo = await userModel.findOne({email:isAdmin.email})
        if(adminInfo.status==false){
            req.session.flash={
                type:0,
                message:"Your account has been locked, please contact to 19002541 to complain"
            }
            return res.redirect('/admin/login')
        }
    }
    catch (e) {
        return res.redirect('/admin/login')
    }
    if (isAdmin.role >= 2 && isAdmin.role != 3) {
        next()
    }
    else {
        res.redirect('/admin/orders')
    }
}

async function authStore(req, res, next) {
    var token = req.cookies.tokenAdmin
    if (!token) {
        return res.redirect('/admin/login')
    }
    try {
        var isAdmin = jwt.verify(token, process.env.ADMIN_SECRET)
        var adminInfo = await userModel.findOne({email:isAdmin.email})
        if(adminInfo.status==false){
            req.session.flash={
                type:0,
                message:"Your account has been locked, please contact to 19002541 to complain"
            }
            return res.redirect('/admin/login')
        }
    }
    catch (e) {
        res.redirect('/admin/login')
    }
    if (isAdmin.role >= 3 && isAdmin.role != 2) {
        next()
    }
    else {
        res.redirect('/admin/warehouse')
    }
}

module.exports = { authStore, authSuperAdmin, authWarehouse }