var mongoose =require('mongoose')

var schema=mongoose.Schema({
    email:String,
    trxID:String,
    orderID:String,
    amount:Number,
    status:{type:String,default:'pending'},
    url:String,
    createAt:Date,
})

module.exports=mongoose.model('historyTrx',schema)