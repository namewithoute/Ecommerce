var mongoose =require('mongoose')

var schema= mongoose.Schema({
    email:String,
    item:[{
        id:String,
        size:String,
        color:String,
        quantity:Number,
        price:Number,
        _id:false
    }],
    shippingFee:Number,
    total:Number
})

module.exports=mongoose.model('cart',schema)