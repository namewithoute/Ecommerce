var orderModel = require('../models/order')
var userModel = require('../models/userAccount')
var voucherModel=require('../models/voucher')
var itemModel = require('../models/item')
var moment = require('moment')
async function adminOrder(req, res) {
    var page = req.params.page
    var orderPerPage = 10
    var allOrder = await orderModel.find({})
    console.log(allOrder)
    var orders = []
    for (var i = 0; i < allOrder.length; i++) {
        var name = await userModel.findOne({ email: allOrder[i].email })
        var phone = name.phone
        name = `${name.firstName} ${name.lastName}`
        var { orderID, createAt, deliveryStatus, total, isPaid } = allOrder[i]
        var formatDate = moment(createAt).format('L')
        orders.push({ orderID, name, phone, createAt: formatDate, status: deliveryStatus.status, total, isPaid })
    }
    console.log(orders)
    res.render('adminOrder', { orders })
}

async function adminOrderDetail(req, res) {
    var orderInfo = await orderModel.findOne({ orderID: req.params.id })
    var phone
    if (!orderInfo) {
        return res.redirect('/orders')
    }
    var name = await userModel.findOne({ email: orderInfo.email })
    phone = name.phone
    name = `${name.firstName} ${name.lastName}`
    var { orderID, email, createAt, deliveryStatus, subtotal, shippingFee, total, discount, isCancel, isPaid, shippingAddress, itemList, paymentMethod } = orderInfo
    var formatDate = moment(createAt).format('L')
    var itemListAddName = []
    for (var i = 0; i < itemList.length; i++) {
        var itemInfo = await itemModel.findOne({ id: itemList[i].id })
        itemListAddName.push({ name: itemInfo.name, id: itemList[i].id, color: itemList[i].color, size: itemList[i].size, quantity: itemList[i].quantity })
    }

    var order = { orderID, name, email, phone, createAt: formatDate, status: deliveryStatus.status, total, isPaid, subtotal, shippingAddress, shippingFee, discount, isCancel, itemList: itemListAddName, paymentMethod }
    console.log(order)
    res.render('adminOrderDetail', { order })
}

async function adminOrderPUT(req, res) {
    switch (req.body.status) {
        case 'Done':
            var update = await orderModel.findOneAndUpdate({ orderID: req.body.id }, { deliveryStatus: { status: 'Done', updateAt: new Date() }, isPaid: true, isCancel: false })
            if(update.isCancel==true){
                await orderModel.findOneAndUpdate({orderID:update.orderID}, {deliveryStatus: { status: update.deliveryStatus.status, updateAt: update.deliveryStatus.updateAt },isPaid:update.isPaid,isCancel:update.isCancel})
                return res.json({status:0,message:'You can not change the status of this order as it has been cancelled'})
            }
            res.json({status:1,message:'ok'})
            break
        case 'Cancel':
            //check delivery status
            var update = await orderModel.findOneAndUpdate({ orderID: req.body.id }, { isCancel: true })
            if(update.isCancel==true){
                // await orderModel.findByIdAndUpdate({orderID:update.orderID}, {deliveryStatus: { status: update.deliveryStatus.status, updateAt: update.updateAt },isPaid:update.isPaid,isCancel:update.isCancel})
                return res.json({status:0,message:'You can not change the status of this order as it has been cancelled'})
            }
            if(update.deliveryStatus.status =='Done' || update.deliveryStatus.status=='Shipping'){
                await orderModel.findOneAndUpdate({orderID:update.orderID},{isPaid:update.isPaid,isCancel:update.isCancel})
                return res.status(400).json({status:0,message:'You cannot cancel this order as it is being shipped'})
            }
            for (var i = 0; i < update.itemList.length; i++) {
                console.log(update.itemList[i].id)
                await itemModel.findOneAndUpdate({ id: update.itemList[i].id, "classify.color": update.itemList[i].color, "classify.size": update.itemList[i].size }, { $inc: { "classify.$.quantity": update.itemList[i].quantity, "classify.$.sold": -(update.itemList[i].quantity)} }, { multi: true, new: true })
            }
            await voucherModel.findOneAndUpdate({voucherCode:update.discount.voucherCode},{$inc:{quantity:1}})
            res.json({status:1,message:'ok'})
            break;
        case 'Shipping':
            var update = await orderModel.findOneAndUpdate({ orderID: req.body.id }, { deliveryStatus:{status:'Shipping',updateAt:new Date()}})
            if(update.isCancel==true){
                await orderModel.findOneAndUpdate({orderID:update.orderID}, {deliveryStatus: { status: update.deliveryStatus.status, updateAt: update.deliveryStatus.updateAt }})
                return res.json({status:0,message:'You can not change the status of this order as it has been cancelled'})
            }
            res.json({status:1,message:'ok'})
            break
        case 'Confirm':
            var update = await orderModel.findOneAndUpdate({ orderID: req.body.id }, { deliveryStatus:{status:'Confirm',updateAt:new Date()}})
            if(update.isCancel==true){
                console.log(update)
                await orderModel.findOneAndUpdate({orderID:update.orderID}, {deliveryStatus: { status: update.deliveryStatus.status, updateAt: update.deliveryStatus.updateAt }})
                return res.json({status:0,message:'You can not change the status of this order as it has been cancelled'})
            }
            res.json({status:1,message:'ok'})

            break
        case 'Packing':
            var update = await orderModel.findOneAndUpdate({ orderID: req.body.id }, { deliveryStatus:{status:'Packing',updateAt:new Date()}})
            if(update.isCancel==true){
                await orderModel.findOneAndUpdate({orderID:update.orderID}, {deliveryStatus: { status: update.deliveryStatus.status, updateAt: update.deliveryStatus.updateAt }})
                return res.json({status:0,message:'You can not change the status of this order as it has been cancelled'})
            }
            res.json({status:1,message:'ok'})

            break
        default:
            res.json({status:0,message:'Invalid status'})
        }   

}


module.exports = {
    adminOrder, adminOrderDetail, adminOrderPUT
}