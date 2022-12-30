var router = require('express').Router()
var {loginGET,loginPOST,loginSSO}=require('../middlewares/login')

router.get('/',loginGET)
router.post('/',loginPOST)

module.exports=router