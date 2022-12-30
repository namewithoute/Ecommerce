const stripe = require('stripe')(process.env.STRIPE_SECRET)
const historyTrx = require('../models/historyTrx');
const itemModel = require('../models/item');
const orderModel = require('../models/order');
const userModel = require('../models/userAccount');
const cartModel = require('../models/cart')
const voucherModel=require('../models/voucher')

async function webhook(req, res) {
    console.log(req.originalUrl)
    let event;
    var endpointSecret = 'whsec_fd2886a4815c9b16bcbd2f22ef1bd48cbe285fe8e39bf65b79a6e5817aa07df7'

    try {
        const sig = req.headers['stripe-signature'];
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`❌ Error message: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    console.log(event)
    // Successfully constructed event
    if (event.type === 'checkout.session.completed') {
        await orderModel.updateOne({ orderID: event.data.object.client_reference_id }, { isPaid: true, isCancel: false })
        await historyTrx.updateOne({orderID: event.data.object.client_reference_id}, {status: 'paid'})
        var deleteCart = await cartModel.findOneAndDelete({email:event.data.object.customer_email})
    }
    else if (event.type == 'checkout.session.expired') {
        console.log(event.data.object.client_reference_id)
        var order = await orderModel.findOneAndUpdate({ orderID:  event.data.object.client_reference_id }, { isPaid: false, isCancel: true })
        for (var i = 0; i < order.itemList.length; i++) {
            console.log(order.itemList[i].id)
            var update = await itemModel.findOneAndUpdate({ id: order.itemList[i].id, "classify.color": order.itemList[i].color, "classify.size": order.itemList[i].size }, { $inc: { "classify.$.quantity": order.itemList[i].quantity, "classify.$.sold": -(order.itemList[i].quantity)} }, { multi: true, new: true })
        }
        if(order.discount.value!=0)
        await voucherModel.updateOne({voucherCode:order.discount.voucherCode},{$inc:{quantity:1}})

        await historyTrx.updateOne({orderID:event.data.object.client_reference_id},{status:'cancel'})
    }
    res.json({ received: true });
}

module.exports = webhook
