var mongoose = require('mongoose')

var orderSchema=mongoose.Schema({
    orderID:String,
    email:String,
    paymentMethod:String,
    isPaid:Boolean,
    itemList:[{
        id:String,
        color:String,
        size:String,
        quantity:Number,
        price:Number,
        _id:false
    }],
    subtotal:Number,
    total:Number,
    shippingFee:Number,
    note:String,
    discount:{
        voucherCode:String,
        value:Number
    },
    deliveryStatus:{
        'status':String,
        updateAt:Date
    },
    isCancel:Boolean,
    shippingAddress:String,
    createAt:Date,
})

module.exports=mongoose.model('order',orderSchema)