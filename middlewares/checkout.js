var userModel = require('../models/userAccount')
var cartModel = require('../models/cart')
var itemModel = require('../models/item')
var orderModel = require('../models/order')
var voucherModel = require('../models/voucher')
var fetch = require('node-fetch')
var jwt = require('jsonwebtoken')
var shortid = require('shortid')
const cart = require('../models/cart')
var conn = require('../config/connectDB')
const historyTrx = require('../models/historyTrx')
const stripe = require('stripe')(process.env.STRIPE_SECRET)

require('dotenv').config()





async function calVolumeOrder(cart) {
  var widthSum = 0
  var heightSum = 0
  var lengthSum = 0
  var weightSum = 0
  var arrLength = []
  var arrWidth = []
  var itemInfo = []
  for (var i = 0; i < cart.length; i++) {
    var itemVolume = await itemModel.findOne({ id: cart[i].id })
    let { height, weight, length, width } = itemVolume.volume
    heightSum += height * cart[i].quantity
    weightSum += weight * cart[i].quantity
    arrLength.push(length)
    arrWidth.push(width)
    itemInfo.push({
      price: itemVolume.price,
      quantity: cart[i].quantity
    })
  }
  lengthSum = Math.max(...arrLength)
  widthSum = Math.max(...arrWidth)
  return { widthSum, heightSum, lengthSum, weightSum, itemInfo }
}



async function checkOutGET(req, res) {
  var userInfo = await userModel.findOne({ email: req.data.email })
  var userCart = await cartModel.findOne({ email: req.data.email })
  if (!userCart || userCart.item.length == 0) {
    return res.redirect('/')
  }
  var volumeSum = await calVolumeOrder(userCart.item)
  try {
    fetch('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'token': '10fc2278-5f78-11ed-b824-262f869eb1a7'
      },
      body: JSON.stringify({
        "service_type_id": 2,
        "insurance_value": 1000,
        "coupon": null,
        "from_district_id": 1454,
        "to_district_id": userInfo.address.district.ID,
        "to_ward_code": userInfo.address.ward.ID,
        "height": volumeSum.heightSum,
        "length": volumeSum.lengthSum,
        "weight": volumeSum.weightSum,
        "width": volumeSum.widthSum
      })
    })
      .then((res) => {
        return res.json()
      })
      .then(async (result) => {
        var user = await userModel.findOne({ email: req.data.email })
        var { firstName, lastName, phone, address } = user
        var formatAddress = `${address.specify}, ${address.ward.name},${address.district.name}, ${address.province.name} `
        var fullName = `${firstName} ${lastName}`
        var shippingFee = result.data.total
        var price = 0
        volumeSum.itemInfo.forEach((item) => {
          price = price + (item.price * item.quantity)
        })
        var total = price
        await cartModel.findOneAndUpdate({ email: req.data.email }, { shippingFee: result.data.total, total: total }, { upsert: true })
        res.render('payment', { user: { fullName, formatAddress, phone }, address: { address }, orderAmount: { price, shippingFee, total } })
      })
  }
  catch (e) {
    console.log('err ' + e)
  }

}

async function checkOutPOST(req, res) {
  console.log(req.body)
  var cart = await cartModel.findOne({ email: req.data.email })
  var userInfo = await userModel.findOne({ email: req.data.email })
  var { address } = userInfo
  var formatAddress = `${address.specify}, ${address.ward.name},${address.district.name}, ${address.province.name} `

  var voucher
  console.log(req.body.voucher)

  if (req.body.voucher) {
    voucher = await voucherModel.findOne({ voucherCode: req.body.voucher })
    if (voucher) {
      voucher = { voucherCode: voucher.voucherCode, value: voucher.discount }
    }
    else
      voucher = {value:0}
  }
  else {
    voucher = {value:0}
  }
  var order
  const session = await conn.startSession();
  try {
    session.startTransaction();
    var userCart = await cartModel.findOne({ email: req.data.email }, null, { session })


    if (voucher.value != 0) {
      var outOfVouchers = await voucherModel.findOneAndUpdate({ voucherCode: req.body.voucher }, { $inc: { quantity: -1 } }, { new: true, session })
      console.log(outOfVouchers)
      if (outOfVouchers.quantity <= 0) {
        throw new Error('out of vouchers')
      }
    }


    order = await orderModel.create([{
      orderID: shortid.generate(),
      email: req.data.email,
      paymentMethod: req.body.paymentOption,
      isPaid: false,
      itemList: cart.item,
      subtotal: cart.total,
      total: (cart.total * (1 - voucher.value)) + parseInt(cart.shippingFee),
      shippingFee: cart.shippingFee,
      shippingAddress: formatAddress,
      note: req.body.note,
      deliveryStatus: {
        status: 'Pending',
        updateAt: new Date()
      },
      discount: voucher,
      isCancel: false,
      createAt: new Date()
    }], { session })

    for (var i = 0; i < userCart.item.length; i++) {
      var update = await itemModel.findOneAndUpdate({ id: userCart.item[i].id, "classify.color": userCart.item[i].color, "classify.size": userCart.item[i].size }, { $inc: { "classify.$.quantity": -userCart.item[i].quantity, "classify.$.sold": userCart.item[i].quantity } }, { multi: true, session: session, new: true })
      update.classify.forEach((item) => {
        if (item.quantity < 0) {
          throw new Error('err')
        }
      })
    }
    await session.commitTransaction();
    // res.json({ status: 1 })
  }
  catch (e) {
    console.log(e)
    await session.abortTransaction();
    session.endSession();
    res.redirect('/checkout')
    return
  }
  session.endSession();



  if (req.body.paymentOption == 'credit') {
    var getCart = await cartModel.findOne({ email: req.data.email })
    var itemData = []
    for (var i = 0; i < getCart.item.length; i++) {
      var item = await itemModel.findOne({ id: getCart.item[i].id })
      itemData.push({
        price_data: {
          currency: 'vnd',
          product_data: {
            name: item.name
          },
          unit_amount: item.price,
        },
        quantity: getCart.item[i].quantity
      })
    }

    var option
    if (voucher.value != 0) {
      var coupon = await stripe.coupons.create({
        percent_off: voucher.value * 100, duration: 'once'
      })
      option = {
        payment_method_types: ['card'],
        mode: 'payment',
        client_reference_id: order[0].orderID,
        line_items: itemData,
        customer_email: req.data.email,
        // allow_promotion_codes: true,
        expires_at: Math.floor((new Date().getTime() + 30 * 60 * 1000) / 1000),
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: order[0].shippingFee,
                currency: 'vnd',
              },
              display_name: 'GHN delivery',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 1,
                },
                maximum: {
                  unit: 'business_day',
                  value: 1,
                },
              },
            },
          },
        ],
        discounts: [{
          coupon: coupon.id,
        }],
        success_url: `http://localhost:3000/payment/success`,
        cancel_url: "http://localhost:3000/checkout"
      }
    }
    else {
      option = {
        payment_method_types: ['card'],
        mode: 'payment',
        client_reference_id: order[0].orderID,
        line_items: itemData,
        customer_email: req.data.email,
        expires_at: Math.floor((new Date().getTime() + 30 * 60 * 1000) / 1000),
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: order[0].shippingFee,
                currency: 'vnd',
              },
              display_name: 'GHN delivery',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 1,
                },
                maximum: {
                  unit: 'business_day',
                  value: 1,
                },
              },
            },
          },
        ],
        success_url: `http://localhost:3000/payment/success`,
        cancel_url: "http://localhost:3000/checkout"
      }
    }
    try {
      const session = await stripe.checkout.sessions.create(option)
      var newTrx = await historyTrx.create([{ email: order[0].email, trxID: shortid.generate(), orderID: order[0].orderID, amount: order[0].total, url: session.url, createAt: new Date() }])
      res.redirect(session.url)
    }
    catch (e) {
      console.log(e.message)
      res.redirect('/checkout')
    }
  }
  else {
    await cartModel.deleteOne({ email: req.data.email })
    return res.redirect('/payment/success')
  }

}


module.exports = { checkOutGET, checkOutPOST }