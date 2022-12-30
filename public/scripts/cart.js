const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
});




function removeItem(id, size, color,quantity) {
    var cart = JSON.parse(localStorage.getItem("cart"))
    var afterRemove = cart.filter((item) => {
        return !(item.id == id && item.size == size && item.color == color)
    })
    fetch(`http://localhost:3000/cart/?id=${id}&size=${size}&color=${color}`,{
        method:'DELETE',
        headers:
        {
            'Content-type':'application/json'
        }
    }).then((res)=>{
        return res.json()
    }).then((data)=>{
        if(data.status==1){
            localStorage.setItem('cart', JSON.stringify(afterRemove))
            render()
        }
    })
   
}

function checkIsEmpty(){
    var cart=JSON.parse(localStorage.getItem('cart'))
    if(cart.length==0){
        alert('Your cart is empty')
    }
    else{
        window.location.href='/checkout'
    }
}


function render() {
    var itemsInCart = JSON.parse(localStorage.getItem('cart'))
    var count = document.getElementById('count-item')
    count.innerText = itemsInCart.length + ' ITEMS'
    var root = document.getElementById('container-item')
    var stringHTML = ''
    var price=0
    itemsInCart.forEach((item) => {
        price =price+(item.price*item.quantity)
        let renderItem = `<div class="d-sm-flex justify-content-between my-4 pb-4 border-bottom">
        <div class="media d-block d-sm-flex  text-sm-left">
            <a class="cart-item-thumb mx-auto mr-sm-4" href="#"><img src="${item.img}" alt="Product"></a>
            <div class="media-body pt-3 ">
                <h3 class="product-card-title font-weight-semibold border-0 pb-0 name-cart"><a href="/item/${item.id}" style="text-decoration:none;">${item.name}</a></h3>
                <div class="font-size-sm"><span class="text-muted mr-2">Size:</span class="size-cart">${item.size}</div>
                <div class="font-size-sm"><span class="text-muted mr-2">Color:</span class="color-cart">${item.color}</div>
                <div class="font-size-lg text-primary pt-2 price-cart">${formatter.format(item.price)}</div>
            </div>
        </div>
        <div class="pt-2 pt-sm-0 pl-sm-3 mx-auto mx-sm-0 text-center text-sm-left" style="max-width: 10rem;" >
            <div class="form-group mb-2" >
                <label for="quantity1">Quantity</label>
                <input class="form-control form-control-sm quantity" type="number" oninput="updateQuantity(this.value,'${item.id}','${item.size}','${item.color}')" value="${item.quantity}" min="1" max="99">
            </div>
        
            <button class="btn btn-outline-danger btn-sm btn-block mb-2" type="button" onclick="removeItem('${item.id}','${item.size}','${item.color}',${item.quantity})">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2 mr-1">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>Remove</button>
        </div>
    </div>`
        stringHTML = stringHTML + renderItem
    })
    root.innerHTML = stringHTML
    var subtotal = document.getElementById('sub-total-cart').innerText=formatter.format(price)

}
render()

function clearAll(){
    fetch('http://localhost:3000/cart/all',{
        method:"DELETE",
        headers:{
            'Content-type':'application/json'
        }
    }).then((res)=>{
        return res.json()
    }).then((data)=>{
        localStorage.setItem('cart',JSON.stringify([]))
        render()
    })
   
}

function updateQuantity(value,id,size,color){
    console.log(value)
    
    var cart = JSON.parse(localStorage.getItem('cart'))
    var update=cart.map((item)=>{
        if(item.id==id && item.size==size && item.color == color){
            item.quantity=parseInt(value)
        }
        return item
    })
    fetch('http://localhost:3000/cart',{
        method:'PUT',
        headers:
        {
            'Content-type':'application/json'
        },
        body:JSON.stringify({update})
    }).then((res)=>{
        return res.json()
    }).then((data)=>{
        if(data.status==1){
            localStorage.setItem('cart',JSON.stringify(update))
            render()
        }
    })
}

// function addToOrder(){
//     // var cart = JSON.parse(localStorage.getItem('cart'))
//     // var note =document.getElementById('order-comments').value
 

//     // sessionStorage.setItem('order',JSON.stringify({note,cart}))

//     // var cart = JSON.parse(localStorage.getItem('cart'))
//     // console.log(cart)
//     // cart = cart.map((item)=>{
//     //     return {id:item.id,quantity:item.quantity,size:item.size,color:item.color}
//     // })
//     // fetch('http://localhost:3000/cart',{
//     //     method:'POST',
//     //     headers:{
//     //         'Content-type':'application/json',
//     //         // 'Cookie':'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiZmV4ZWMyNTg3NUBob3hkcy5jb20iLCJyb2xlIjoxLCJpc1ZlcmlmeSI6ZmFsc2V9LCJpYXQiOjE2NjgwNjUxOTZ9.khAXfmDx-fsyf8P3VH_7qBpwFRfzILejL88CVO22vmI'
//     //     },
//     //     body:JSON.stringify({cart})
//     // }).then((res)=>{
//     //     return res.json()
//     // })
//     // .then((status)=>{
//     //     if(status){
//     //         window.location.href='http://localhost:3000/payment'
//     //     }
//     // })


   
// }

