var historyTrxModel=require('../models/historyTrx')
var moment=require('moment')
async function billingGET(req,res){
    var historyTrx=await historyTrxModel.find({email:req.data.email})
    var resData=historyTrx.map((trx)=>{
        return {orderID:trx.orderID,trxID:trx.trxID,amount:trx.amount,url:trx.url,createAt:moment(trx.createAt).format('L'),status:trx.status}
    })
    res.render('billing',{trx:resData})
}

module.exports={billingGET}