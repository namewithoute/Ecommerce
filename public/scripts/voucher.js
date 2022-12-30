function fillInfor(voucherCode,quantity,startAt,expireAt,value){
    var startAt = startAt.split('/')
    var expireAt=expireAt.split('/')
    console.log(startAt,expireAt)
    var formatStart = `${startAt[2]}-${startAt[0]}-${startAt[1]}`
    var formatExpire = `${expireAt[2]}-${expireAt[0]}-${expireAt[1]}`

    document.getElementById('id').value=voucherCode
    document.getElementById('quantity').value=quantity
    document.getElementById('start').value=formatStart
    document.getElementById('expire').value=formatExpire
    document.getElementById('discountValue').value=value*100
}

function submitEditVoucher(){
    var voucherCode=document.getElementById('id').value
    var quantity = document.getElementById('quantity').value
    var start = document.getElementById('start').value
    var end=document.getElementById('expire').value
    var discountValue =document.getElementById('discountValue').value/100
    fetch('http://localhost:3000/admin/voucher',{
        method:'PUT',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({voucherCode,quantity,start,end,discountValue})
    })
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{
        if(data.status==1){
            window.location.href="/admin/voucher"
        }
    })
}   

function submitNewVoucher(){
    var voucherCode=document.getElementById('idAdd').value
    var quantity = document.getElementById('quantityAdd').value
    var start = document.getElementById('startAdd').value
    var end=document.getElementById('expireAdd').value
    var discountValue =document.getElementById('discountValueAdd').value/100
    console.log(voucherCode,quantity,start,end,discountValue)
    fetch('http://localhost:3000/admin/voucher',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({voucherCode,quantity,start,end,discountValue})
    })
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{
        if(data.status==1){
            window.location.href="/admin/voucher"
        }
    })
}

function deleteVoucher(code){
    var cf=confirm('Are you sure want to delete this voucher')
    if(cf){
    var voucherCode=code
    fetch('http://localhost:3000/admin/voucher',{
        method:'DELETE',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({voucherCode})
    })
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{
        if(data.status==1){
            window.location.href="/admin/voucher"
        }
    })
}
}