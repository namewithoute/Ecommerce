const { adminOrder ,adminOrderDetail, adminOrderPUT} = require('../middlewares/adminOrder')
const homepageAdminGET = require('../middlewares/adminDashBoard')
const {adminLoginGET,adminLoginPOST}=require('../middlewares/adminLogin')
const {authStore,authWarehouse,authSuperAdmin}=require('../middlewares/authAdmin')
const {adminWarehouseGET,adminWarehousePUT,adminWareHousePOST,adminWareHouseDELETE}=require('../middlewares/adminWareHouse')
const adminStatistical=require('../middlewares/adminStatistical')
const { adminAccountGET, adminAccountPUT, adminAccountPOST, adminAccountDELETE } = require('../middlewares/adminAccount')
const adminLogout = require('../middlewares/adminLogout')
var upload = require('../config/configMulter')
const { voucherGET,voucherPOST,voucherPUT, voucherDELETE } = require('../middlewares/adminVoucher')
var router = require('express').Router()


router.get('/',(req,res)=>{
    res.redirect('/admin/login')
})

router.get('/login',adminLoginGET)
router.post('/login',adminLoginPOST)
router.get('/dashboard',authSuperAdmin,homepageAdminGET )


router.get('/orders',authStore,adminOrder)
router.get('/orders/:id',authStore,adminOrderDetail)
router.put('/orders',authStore,adminOrderPUT)



router.get('/accounts',authSuperAdmin,adminAccountGET)
router.put('/accounts',authSuperAdmin,adminAccountPUT)
router.post('/accounts',authSuperAdmin,adminAccountPOST)
router.delete('/accounts',authSuperAdmin,adminAccountDELETE)


router.get('/warehouse', authWarehouse,adminWarehouseGET)
router.put('/warehouse',upload.array('files'), authWarehouse,adminWarehousePUT)
router.post('/warehouse',upload.array('files'), authWarehouse,adminWareHousePOST)
router.delete('/warehouse', authWarehouse,adminWareHouseDELETE)


router.get('/voucher',authStore,voucherGET)
router.put('/voucher',authStore,voucherPUT)
router.post('/voucher',authStore,voucherPOST)
router.delete('/voucher',authStore,voucherDELETE)


router.get('/statistical',adminStatistical)
router.get('/logout',adminLogout)
module.exports = router