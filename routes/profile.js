const router=require('express').Router()
const { profileGET,profilePUT } = require('../middlewares/profile');
const auth = require('../middlewares/auth')
router.get('/',auth,profileGET)
router.put('/',auth,profilePUT)

module.exports=router