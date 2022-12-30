function adminLogout(req,res){
    res.clearCookie("tokenAdmin")
    res.redirect('/admin/login')
}
module.exports=adminLogout