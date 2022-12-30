var mongoose= require('mongoose')

var shema = mongoose.Schema({
    otp:Number,
    email:String,
    expireAt: {
        type: Date,
        default:new Date(),
        /* Remove doc 60 seconds after specified date */
        expires: 120
      }
})

module.exports=mongoose.model('otp',shema)