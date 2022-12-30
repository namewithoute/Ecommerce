var router=require('express').Router()
var {changePassGET,changePassPOST}=require('../middlewares/security')
var auth=require('../middlewares/auth')
router.get('/',auth,changePassGET)
router.post('/',auth,changePassPOST)
module.exports=router