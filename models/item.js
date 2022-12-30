var mongoose = require('mongoose')


var item = mongoose.Schema({
    id:String,
    name:String,
    type:String,
    brand:String,
    price:Number,
    description:String,
    img:{
        cover:String,
        detail:[String]
    },
    classify:[{
        _id:false,
        size:String,
        color:String,
        quantity:Number,
        sold:Number,
    }],
    volume:{
        height:Number,
        weight:Number,
        width:Number,
        length:Number,
        _id:false
    },
    evaluate:Number,
})


var itemModel = mongoose.model('item',item)
module.exports=itemModel