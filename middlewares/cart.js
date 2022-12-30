var voucher = require('../models/voucher')
var cartModel = require('../models/cart')
var itemModel = require('../models/item')
// var itemModel = require('../models/itemModel')


async function cartGET(req, res) {
    var cartUser = await cartModel.findOne({ email: req.data.email })
    if (!cartUser) {
        return res.render('cart', { resData: JSON.stringify([]) })
    }

    var concatData = cartUser.item
    for (var i = 0; i < concatData.length; i++) {
        var getImg = await itemModel.findOne({ id: concatData[i].id })
        concatData[i].img = getImg.img.cover
        concatData[i].price = getImg.price
        concatData[i].name = getImg.name
    }
    var resData
    resData = concatData.map((item) => {
        return { id: item.id, name: item.name, color: item.color, size: item.size, img: item.img, quantity: item.quantity, price: item.price }
    })

    res.render('cart', { resData: JSON.stringify(resData) })
}

async function cartPUT(req, res) {
    await cartModel.updateOne({email:req.data.email},{item:req.body.update})
    res.json({status:1})
}

async function cartDeleteItem(req,res){
    var itemList=await cartModel.findOne({email:req.data.email})
    console.log(itemList)
    var container=[]
    var {size,color,id}=req.query
    itemList.item.forEach((item)=>{
        if(!(item.id==id && item.color==color && item.size == size)){
            container.push(item)
        }
    })
    console.log(container)
    await cartModel.updateOne({email:req.data.email},{item:container})
    res.json({status:1})
}

async function cartDeleteAll(req,res){
    await cartModel.deleteOne({email:req.data.email})
    res.json({status:1})
}




async function addToCartPOST(req, res) {
    var { id, size, color, quantity } = req.body.cart

    var cartInfo = await cartModel.findOne({ email: req.data.email })
    if (!cartInfo || cartInfo.item.length == 0) {
        await cartModel.findOneAndUpdate({ email: req.data.email }, { item: req.body.cart }, { upsert: true })
        return res.json({ status: 1 })
    }
    var isSame=0
    for(var i =0;i<cartInfo.item.length;i++){
        if(cartInfo.item[i].id==id && cartInfo.item[i].color==color && cartInfo.item[i].size==size){
            cartInfo.item[i].quantity+=quantity
            isSame+=1
        }
    }
    if(isSame!=0){
        await cartModel.updateOne({ email: req.data.email }, { item: cartInfo.item}, { upsert: true })
        return res.json({status:1})
    }
    console.log(req.body.cart)
    await cartModel.updateOne({email:req.data.email},{$push:{item:req.body.cart}})

}


async function checkPromoCode(req, res) {
    console.log(req.params.code)
    var promocode = await voucher.findOne({ voucherCode: req.params.code })
    if (!promocode) {
        return res.json({ status: 0 })
    }
    var startTimeStamp = new Date(promocode.startAt).getTime()
    var endTimeStamp = new Date(promocode.expireDate).getTime
    var now = new Date().getTime()
    console.log(now)
    if (now < startTimeStamp || now > endTimeStamp) {
        return res.json({ status: 0 })
    }
    if (promocode.quantity <= 0) {
        return res.json({ status: 0 })
    }
    res.json({ status: 1, discountvalue: promocode.discount })

}

module.exports = {
    cartGET,
    checkPromoCode, addToCartPOST, cartPUT,cartDeleteItem,cartDeleteAll
}