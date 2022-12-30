// var loginMD = require('../middlewares/login')
// var homepageMD = require('../middlewares/homepage')
// var detailMD=require('../middlewares/detail')
// var registerMD = require('../middlewares/register')
// const { body } = require('express-validator');
var logout = require('../middlewares/logout')
var express=require('express')
// var {billingGET} = require('../middlewares/billing')
var auth = require('../middlewares/auth')
var errorMD = require('../middlewares/error')
var { cartGET, checkPromoCode, addToCartPOST, cartPUT, cartDeleteItem, cartDeleteAll } = require('../middlewares/cart')
var { checkOutGET, paymentPOST } = require('../middlewares/checkout')
var passport = require('passport')
const config = require('../config/configPassport');
// const { profileGET,profilePUT } = require('../middlewares/profile');
const { paymentCreditGET, paymentCreditPOST } = require('../middlewares/paymentCredit');
const { paymentSuccess, paymentFail } = require('../middlewares/paymentNoti');
const { verifyGET, verifyPOST } = require('../middlewares/verify');
const { checkVerify, checkInfor } = require('../middlewares/checkVerify')
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET)

const loginRoute = require('./login')
const itemRoute = require('./item')
const profileRoute = require('./profile')
const registerRoute = require('./register')
const authSSORoute = require('./sso')
const billingRoute = require('./billing')
const cartRoute = require('./cart')
const checkoutRoute = require('./checkout')
const webhook = require('../middlewares/webhook')
var changePassRoute=require('./changePassword')
var orderRoute=require('./order')
var adminRoute=require('./admin')
const createOTP = require('../middlewares/createOTP')
// config()
function route(app) {
        // app.get('/', homepageMD.homepageGET)
        // app.get('/item/:id',detailMD)
        // app.get('/login',loginMD.loginGET)
        // app.post('/login', loginMD.loginPOST)
        app.use('/', itemRoute)
        app.use('/login', loginRoute)
        // app.get('/profile',auth,profileGET)
        // app.put('/profile',auth,profilePUT)
        app.use('/profile', profileRoute)

        app.get('/logout', logout)
        app.use('/register', registerRoute)
        app.use('/auth/google', authSSORoute)
        // app.get('/register',registerMD.registerGET)
        // app.post('/register',
        //         body('email').isEmail(),
        //         body('password').isLength({ min: 5 }),
        //         body('city').not().isEmpty(),
        //         body('district').not().isEmpty(),
        //         body('ward').not().isEmpty(),
        //         body('phone').not().isEmpty().isLength({min:10}),
        //         body('specify').not().isEmpty()
        //         , registerMD.registerPOST)

        app.use('/billing', billingRoute)
        app.use('/change-password', changePassRoute)
        app.use('/order',orderRoute)
        // app.get('/auth/google', passport.authenticate('google', {
        //         scope: [
        //                 'https://www.googleapis.com/auth/userinfo.profile',
        //                 'https://www.googleapis.com/auth/userinfo.email',
        //                 'https://www.googleapis.com/auth/user.birthday.read',
        //                 'https://www.googleapis.com/auth/user.gender.read',
        //                 'https://www.googleapis.com/auth/user.phonenumbers.read'
        //         ]
        // }));

        app.use('/cart', cartRoute)
        // app.get('/cart',auth,cartGET)
        // app.put('/cart',auth,cartPUT)
        // app.delete('/cart',auth,cartDeleteItem)
        // app.delete('/cart/all',auth,cartDeleteAll)
        // app.post('/cart',auth,addToCartPOST)

        app.use('/checkout/', checkoutRoute)

        // app.get('/payment',auth,checkInfor,checkVerify,checkOutGET)
        // app.post('/payment',auth,paymentPOST)
        app.get('/check-promo-code/:code', checkPromoCode)


        // app.get('/payment/checkout-session',auth,paymentCreditGET)

        // app.post('/payment/checkout-session',auth,paymentCreditPOST)
        app.post('/webhook',  express.raw({type: "application/json"}), webhook)

        //admin route

        app.use('/admin',adminRoute)


// app.get('/auth/google/userinfo',
//         passport.authenticate('google', { failureRedirect: '/login' }), loginMD.loginSSO);


app.get('/payment/success', paymentSuccess)
app.get('/payment/fail', paymentFail)

app.post('/verify/create-otp',auth,createOTP)

app.get('/profile/verify', auth, verifyGET)
app.post('/profile/verify', auth, verifyPOST)
        // app.use(errorMD)

}

module.exports = route