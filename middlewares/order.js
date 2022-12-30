var order=require('../models/order')
var userModel=require('../models/userAccount')
var voucherModel=require('../models/voucher')
var itemModel=require('../models/item')
var moment=require('moment')
async function orderGET(req,res){
    var orders=await order.find({email:req.data.email})
    console.log(orders)
    var trackingAr=orders.map((order)=>{
        return {orderID:order.orderID,deliveryStatus:order.deliveryStatus}
    })
    res.render('order',{res:trackingAr})
}

async function orderDetailGET(req,res){
    var id=req.params.id
    var userInfo = await userModel.findOne({email:req.data.email})
    console.log(userInfo)
    var name = `${userInfo.firstName} ${userInfo.lastName}`
    var validateOwner=await order.findOne({orderID:id,email:req.data.email})
    if(!validateOwner){
        return res.redirect('/login')
    }    
    var {orderID,itemList,deliveryStatus,shippingFee,shippingAddress,subtotal,total,discount,paymentMethod,createAt,note,isPaid,isCancel}=validateOwner
    var items=[]
    console.log(isPaid)
    for(var i = 0 ; i <itemList.length;i++){
        var itemInfo = await itemModel.findOne({id:itemList[i].id})
        items.push({id:itemList[i].id,color:itemList[i].color,size:itemList[i].size,price:itemList[i].price,name:itemInfo.name,img:itemInfo.img.cover})
    }
    var formatDate= moment(createAt).format('L')

    var resData={orderID,items,deliveryStatus,shippingAddress,shippingFee,discount,paymentMethod,formatDate,note,subtotal,total,isPaid,user:name,phone:userInfo.phone,isCancel}
    console.log(items)
    res.render('orderDetail',{res:resData})
}

async function orderCanelPUT(req,res){
    console.log(req.body)
    var update = await order.findOneAndUpdate({ orderID: req.body.orderID }, { isCancel: true })
    if(update.isCancel==true){
        // await orderModel.findByIdAndUpdate({orderID:update.orderID}, {deliveryStatus: { status: update.deliveryStatus.status, updateAt: update.updateAt },isPaid:update.isPaid,isCancel:update.isCancel})
        return res.json({status:0,message:'You can not change the status of this order as it has been cancelled'})
    }
    if(update.deliveryStatus.status =='Done' || update.deliveryStatus.status=='Shipping'){
        await order.findOneAndUpdate({orderID:update.orderID},{isPaid:update.isPaid,isCancel:update.isCancel})
        return res.status(400).json({status:0,message:'You cannot cancel this order as it is being shipped'})
    }
    for (var i = 0; i < update.itemList.length; i++) {
        console.log(update.itemList[i].id)
        await itemModel.findOneAndUpdate({ id: update.itemList[i].id, "classify.color": update.itemList[i].color, "classify.size": update.itemList[i].size }, { $inc: { "classify.$.quantity": update.itemList[i].quantity, "classify.$.sold": -(update.itemList[i].quantity)} }, { multi: true, new: true })
    }
    await voucherModel.findOneAndUpdate({voucherCode:update.discount.voucherCode},{$inc:{quantity:1}})

    res.json({status:1,message:'ok'})

}

module.exports={orderGET,orderDetailGET,orderCanelPUT}