var router=require('express').Router()
var {checkOutGET,checkOutPOST}=require('../middlewares/checkout')
var auth=require('../middlewares/auth')
var {checkInfor,checkVerify}=require('../middlewares/checkVerify')
const {paymentCreditGET,paymentCreditPOST} = require('../middlewares/paymentCredit');


router.get('/',auth,checkInfor,checkVerify,checkOutGET)
router.post('/',auth,checkInfor,checkVerify,checkOutPOST)

// router.get('/credit',auth,paymentCreditGET)
// router.post('/credit',auth,paymentCreditPOST)

module.exports=router