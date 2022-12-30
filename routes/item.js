const router= require('express').Router()
var homepageMD = require('../middlewares/homepage')
var detailMD=require('../middlewares/detail')

router.get('/',homepageMD.homepageGET)
router.get('/item/:id',detailMD)

module.exports=router