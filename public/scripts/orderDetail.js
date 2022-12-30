function cancelOrder(id){
    var confirmCancel = confirm('Are you sure want to cancel this order')
    console.log(id)
    if(confirmCancel){
    fetch('http://localhost:3000/order/',{
        method:'PUT',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({orderID:id})
    })
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{
        if(data.status==1){
            return location.reload()
        }
        alert(data.message)

    })
}
}