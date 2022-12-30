var itemModel = require('../models/item')


async function homepageGET(req, res, next) {
    var page = req.query.page || 1
    var items = await itemModel.find({})
    var pageNav = Math.ceil(items.length / 8)
    if (page <= 0 || page > pageNav) {
        var err = new Error("Page not found")
        next(err)
        return
    }
    var skipPage = page - 1
    console.log(skipPage)
    var items = await itemModel.find({}).skip(skipPage * 8).limit(8)
    var dataToClient = items.map((item) => {
        var { id, name, price, evaluate, img } = item
        return {
            id, name, price, evaluate, img
        }
    })
    var specialItem = await itemModel.find({ 'classify.quantity': { $lt: 50 } }).limit(4)
    console.log(specialItem)
    specialItem = specialItem.map((item) => {
        var { id, name, price, evaluate, img } = item
        return {
            id, name, price, evaluate, img

        }
    })
    res.render('homepage', { res: dataToClient, resPage: [pageNav, page] ,specialItem});
}

module.exports = {
    homepageGET
}
