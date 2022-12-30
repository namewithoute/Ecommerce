var mongoose = require('mongoose')

var voucherSchema = mongoose.Schema({
    voucherCode:String,
    discount:Number,
    startAt:Date,
    expireDate:Date,
    quantity:Number
})

module.exports=mongoose.model('voucher',voucherSchema)