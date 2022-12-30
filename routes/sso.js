const router = require('express').Router()
const passport = require('passport')
var config=require('../config/configPassport')
var { loginSSO } = require('../middlewares/login')
config()
router.get('/',passport.authenticate('google', {
    scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/user.birthday.read',
            'https://www.googleapis.com/auth/user.gender.read',
            'https://www.googleapis.com/auth/user.phonenumbers.read'
    ]
}))


router.get('/userinfo', passport.authenticate('google',{ failureRedirect: '/login' }), loginSSO);

module.exports = router