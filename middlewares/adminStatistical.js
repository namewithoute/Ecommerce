var trxModel = require('../models/historyTrx')
var orderModel = require('../models/order')
var moment = require('moment')
async function adminStatistical(req, res) {
    var orders = await orderModel.find({ isPaid: true, isCancel: false })
    // console.log(new Date(order[0].createAt).getMonth())
    var tunover = []
    var nowMonth = new Date().getMonth() + 1
    for (var i = 1; i <= nowMonth; i++) {
        tunover[i - 1] = 0
        console.log(i - 1)
        orders.forEach((order) => {
            if (new Date(order.createAt).getMonth() + 1 == i) {
                tunover[i - 1] += order.subtotal
            }
        })
    }

    var orderCancel = await orderModel.find({ isCancel: true })
    var orderDone = await orderModel.find({ isCancel: false, isPaid: true, "deliveryStatus.status": 'Done' })
    var orderProcess = await orderModel.find({ isCancel: false, "deliveryStatus.status": { $ne: 'done' } })

    var noOrder = await orderModel.find()
    noOrder = noOrder.length
    var barChart = [(orderCancel.length / noOrder) * 100, (orderProcess.length / noOrder) * 100, (orderDone.length / noOrder) * 100]
    console.log(noOrder)

    //get all day
    console.log(orders)
    var statisticalByDay = []
    for (var i = 0; i <= 6; i++) {
        statisticalByDay[i] = 0
        orders.forEach((order) => {
            if (new Date(order.createAt).getDay() == i) {
                statisticalByDay[i] += order.subtotal
            }
        })
    }
    console.log(statisticalByDay)



    res.render('adminStatistical', { tunover: JSON.stringify(tunover), orderChart: JSON.stringify(barChart),tunoverByDay:JSON.stringify(statisticalByDay) })


}

module.exports = adminStatistical