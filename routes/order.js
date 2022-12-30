var router=require('express').Router()
var {orderGET,orderDetailGET, orderCanelPUT}=require('../middlewares/order')
var auth = require('../middlewares/auth')
router.get('/',auth,orderGET)
router.get('/:id',auth,orderDetailGET)
router.put('/',auth,orderCanelPUT)

module.exports=router