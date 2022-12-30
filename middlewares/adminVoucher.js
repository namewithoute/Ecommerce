var voucherModel = require('../models/voucher')
var moment = require('moment')

async function voucherGET(req, res) {
    var voucherList = await voucherModel.find({})
    var formatDate = voucherList.map((voucher) => {
        var { voucherCode, discount, quantity, startAt, expireDate } = voucher
        var formatStart = moment(startAt).format('L')
        var formartExpireAt = moment(expireDate).format('L')
        return { voucherCode, discount, quantity, startAt: formatStart, expireAt: formartExpireAt }
    })
    console.log(formatDate)
    res.render('adminVoucher', { vouchers: formatDate })
}

async function voucherPOST(req, res) {
    var start = req.body.start.split('-')
    var startAt=`${start[1]}-${start[2]}-${start[0]}`
    var end = req.body.end.split('-')
    var endAt=`${end[1]}-${end[2]}-${end[0]}`
    new voucherModel({
        voucherCode: req.body.voucherCode,
        discount: req.body.discountValue,
        quantity: req.body.quantity,
        startAt: startAt,
        expireDate: endAt,
    }).save()
    res.json({ status: 1, message: 'ok' })
}

async function voucherDELETE(req,res){
    console.log(req.body.voucherCode)
    var voucher = await voucherModel.findOneAndDelete({voucherCode:req.body.voucherCode})
    if(voucher){
        return res.json({status:1,message:'ok'})
    }
}

async function voucherPUT(req, res) {
    var start = req.body.start.split('-')
    var startAt=`${start[1]}-${start[2]}-${start[0]}`
    var end = req.body.end.split('-')
    var endAt=`${end[1]}-${end[2]}-${end[0]}`
    await voucherModel.findOneAndUpdate({ voucherCode: req.body.voucherCode }, {
        discount: req.body.discountValue,
        quantity: req.body.quantity,
        expireDate: endAt,
        startAt:startAt
    })
    res.json({ status: 1, message: 'ok' })
}

module.exports = {
    voucherGET, voucherPOST, voucherPUT,voucherDELETE
}