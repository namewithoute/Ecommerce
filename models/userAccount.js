var mongoose =require('mongoose')

var userShema= mongoose.Schema({
    email:String,
    phone:String,
    password:String,
    typeLogin:String,
    firstName:String,
    lastName:String,
    status:{type:Boolean,default:true},
    gender:String,
    role:{type:Number,default:1},
    address:{
        province:{
            name:String,
            ID:Number
        },
        district:{
            name:String,
            ID:Number
        },
        ward:{
            name:String,
            ID:String
        },
        specify:String
    },
    dob:Date,
    createAt:Date,
    updateAt:Date,
    isVerify:{type:Boolean,default:false},
 
})

var userModel = mongoose.model('user',userShema)
module.exports=userModel