var router = require('express').Router()
var {billingGET} = require('../middlewares/billing')
var auth = require('../middlewares/auth')

router.get('/',auth,billingGET)

module.exports=router