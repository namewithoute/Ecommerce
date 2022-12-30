function paymentSuccess(req,res){
    res.render('orderSuccess')
}
function paymentFail(req,res){
    res.render('orderFail')
}
module.exports={paymentSuccess,paymentFail}
