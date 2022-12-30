var itemModel = require('../models/item')

module.exports=async function(req,res){
    var item = await itemModel.findOne({id:req.params.id},{_id:false})
    res.render('item',{item:item})
}