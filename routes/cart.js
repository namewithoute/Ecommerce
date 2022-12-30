const route=require('express').Router()
var auth=require('../middlewares/auth')
var {cartGET,cartPUT,addToCartPOST,cartDeleteItem,cartDeleteAll}=require('../middlewares/cart')
route.get('/',auth,cartGET)
route.put('/',auth,cartPUT)
route.delete('/',auth,cartDeleteItem)
route.delete('/all',auth,cartDeleteAll)
route.post('/',auth,addToCartPOST)

module.exports=route