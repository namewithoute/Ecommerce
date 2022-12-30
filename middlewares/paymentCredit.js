require('dotenv').config
var cartModel = require('../models/cart')
const itemModel = require('../models/item')
const stripe = require('stripe')(process.env.STRIPE_SECRET)

function paymentCreditGET(req, res) {
  res.render('paymentCredit')
}

async function paymentCreditPOST(req, res) {
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

  var coupon = await stripe.coupons.create({
    percent_off: 20, duration: 'once'
  })
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      client_reference_id: '1231',
      line_items: itemData,
      // allow_promotion_codes: true,
      expires_at: Math.floor((new Date().getTime() + 60 * 60 * 1000) / 1000),
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: 'vnd',
            },
            display_name: 'Next day air',
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
      cancel_url: "http://localhost:3000/payment/fail"
    })
    await cartModel.findOneAndDelete({email:req.data.email})
    res.json(session.url)
  }
  catch (e) {
    console.log(e.message)
  }
}

module.exports = { paymentCreditGET, paymentCreditPOST }