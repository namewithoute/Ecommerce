var itemModel = require('../models/item')
var historyTrxModel = require('../models/historyTrx')
var orderModel = require('../models/order')
var moment = require('moment')
const userModel = require('../models/userAccount')

async function homepageAdminGET (req, res) {
    var getAllItemLessThan10 = await itemModel.find({ "classify.quantity": { $lt: 10 } })
    var getItemDetail = []
    getAllItemLessThan10.forEach((item) => {
        item.classify.forEach((innerItem) => {
            if (innerItem.quantity < 10) {
                getItemDetail.push({ innerItem, id: item.id, name: item.name })
            }
        })
    })
    var getActivityTrx = await historyTrxModel.find().sort({ createAt: -1 })
    var getActivityOrder = await orderModel.find().sort({ createAt: -1 })
    var getUpdateProfile=await userModel.find()
    var getActivity
    getActivity = getActivityTrx.map((action) => {
        return { date: action.createAt, type: 'payment', email: action.email }
    })
    getActivityOrder.forEach((action) => {
        getActivity.push({ date: action.createAt, type: 'creat order', email: action.email })
    })
    getUpdateProfile.forEach((action)=>{
        getActivity.push({date:action.createAt,type:'Create account',email:action.email})
        if(action.updateAt){
            getActivity.push({date:action.updateAt,type:'update information',email:action.email})
        }
    })

    var sortedAsc = getActivity.sort(
        (objA, objB) =>  Number(objB.date)-Number(objA.date),
      );
       sortedAsc=sortedAsc.map((action)=>{
        return{type:action.type,email:action.email,date:moment(action.date).startOf('minute').fromNow()}
       }) 
      res.render('indexAdmin', { resData: getItemDetail, activity: sortedAsc })
}

module.exports=homepageAdminGET