const router = require('express').Router()
var { registerGET, registerPOST } = require('../middlewares/register')
const { body } = require('express-validator');

router.get('/', registerGET)
router.post('/', body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('firstName').not().isEmpty(),
    body('lastName').not().isEmpty(),
    body('gender').not().isEmpty(),
    body('phone').not().isEmpty().isLength({ min: 10 }),
    registerPOST)

module.exports=router