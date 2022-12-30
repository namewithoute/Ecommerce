const itemModel = require('../models/item')

async function adminWarehouseGET(req, res) {
    var itemPerPage = 7
    var page = req.query.page || 0
    page = page-1 ? page!=0 :page
    console.log(page)

    var item = await itemModel.find({}).skip(page * itemPerPage).limit(itemPerPage)
    res.render('adminWarehouse', { itemList: item })
}

async function adminWarehousePUT(req, res) {
    var dataText = JSON.parse(req.body.dataText)

    var imgDetail = []

    for (var i = 1; i < req.files.length; i++) {
        imgDetail.push('/img/' + req.files[i].filename)
    }
    console.log(dataText)
    var option
    console.log(req.files)
    if (!req.files.length) {
        option = {
            name: dataText.name,
            price: dataText.price,
            brand: dataText.brand,
            type: dataText.type,
            evaluate: dataText.evaluate,
            volume: {
                height: parseInt(dataText.height),
                weight: parseInt(dataText.weight),
                length: parseInt(dataText.length),
                width: parseInt(dataText.width)
            },
            classify: dataText.listValue,
            description: dataText.description,
        }
    }
    else {
        option = {
            name: dataText.name,
            price: dataText.price,
            brand: dataText.brand,
            type: dataText.type,
            evaluate: dataText.evaluate,
            volume: {
                height: parseInt(dataText.height),
                weight: parseInt(dataText.weight),
                length: parseInt(dataText.length),
                width: parseInt(dataText.width)
            },
            classify: dataText.listValue,
            description: dataText.description,
            img: {
                cover: '/img/' + req.files[0].filename,
                detail: imgDetail
            }
        }
    }
    var update = await itemModel.findOneAndUpdate({ id: dataText.id }, option)
    res.status(200).json({ status: 1, message: 'ok' })
}

async function adminWareHousePOST(req, res) {
    var dataText = JSON.parse(req.body.dataText)
    var imgDetail = []
    var checkID =await itemModel.findOne({id:dataText.id})
    if(checkID){
        return res.json({status:0,message:'id existed'})
    }
    for (var i = 1; i < req.files.length; i++) {
        imgDetail.push('/img/' + req.files[i].filename)
    }
    await itemModel.create([{
        id:dataText.id,
        name: dataText.name,
        price: dataText.price,
        brand: dataText.brand,
        type: dataText.type,
        evaluate: dataText.evaluate,
        volume: {
            height: parseInt(dataText.height),
            weight: parseInt(dataText.weight),
            length: parseInt(dataText.length),
            width: parseInt(dataText.width)
        },
        classify: dataText.listValue,
        description: dataText.description,
        img: {
            cover: '/img/' + req.files[0].filename,
            detail: imgDetail
        }
    }])
    res.status(200).json({ status: 1, message: 'ok' })

}


async function adminWareHouseDELETE(req, res) {
    console.log(req.body.id)
    await itemModel.findOneAndDelete({id:req.body.id})
    res.status(200).json({status:1,message:'ok'})
}

module.exports = {
    adminWarehouseGET, adminWarehousePUT, adminWareHousePOST, adminWareHouseDELETE
}