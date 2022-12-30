module.exports=function(err, req,res,next){
    console.log(err)
    res.status(404).send({mesage:"page not found"})
}