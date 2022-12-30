const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
});

// const ADDRESS = JSON.parse(sessionStorage.getItem('address'))
// const ORDER = JSON.parse(sessionStorage.getItem('order'))


// var volumeSum = calVolumeOrder(ORDER.cart)
// console.log(volumeSum)
// fetch('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
//     method: 'POST',
//     headers: {
//         'Content-type': 'application/json',
//         'token': '10fc2278-5f78-11ed-b824-262f869eb1a7'
//     },
//     body: JSON.stringify({
//         "service_type_id": 2,
//         "insurance_value": 1000,
//         "coupon": null,
//         "from_district_id": 1454,
//         "to_district_id": ADDRESS.district.ID,
//         "to_ward_code": ADDRESS.ward.ID,
//         "height": volumeSum.heightSum,
//         "length": volumeSum.lengthSum,
//         "weight": volumeSum.weightSum,
//         "width": volumeSum.widthSum
//     })
// })
//     .then((res) => {
//         return res.json()
//     })
//     .then((result) => {
//         SHIPPING_FEES =result.data.total
//         ship.innerText = formatter.format(result.data.total)
//         total.innerText = formatter.format(price+result.data.total)
//         console.log(result)
//     })


// function calVolumeOrder(cart) {
//     var widthSum = 0
//     var heightSum = 0
//     var lengthSum = 0
//     var weightSum = 0
//     var arrLength = []
//     var arrWidth = []
//     cart.forEach((item) => {
//         let { height, weight, length, width } = item.volume
//         heightSum += height * item.quantity
//         weightSum += weight * item.quantity
//         console.log(item.volume)
//         arrLength.push(length)
//         arrWidth.push(width)
//     })
//     lengthSum = Math.max(...arrLength)
//     widthSum = Math.max(...arrWidth)
//     console.log(lengthSum, widthSum, arrLength, arrWidth)

//     return { widthSum, heightSum, lengthSum, weightSum }
// }

var subtotal = document.getElementById('sub-total').innerHTML
console.log(subtotal)
var ship = document.getElementById('shipping').innerHTML
var discount = document.getElementById('discount')
var total = document.getElementById('total').innerHTML

document.getElementById('shipping').innerHTML=formatter.format(ship)
document.getElementById('sub-total').innerHTML=formatter.format(subtotal)
document.getElementById('total').innerHTML=formatter.format(total)



// subtotal.innerText = formatter.format(price)

// discount.innerText=formatter.format(-20000)

function getDiscount() {
    document.getElementById('alertPromo').style.display='none'
    var promo = document.getElementById('cart-promocode').value
   
    fetch('http://localhost:3000/check-promo-code/' + promo)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            if(data.status==0){
                document.getElementById('alertPromo').style.display='block'
            }
            else{
            discount.innerText = `- ${data.discountvalue * 100}%`
            console.log(subtotal , data.discountvalue,ship)
            document.getElementById('total').innerHTML = formatter.format(parseInt(subtotal) * (1 - data.discountvalue) + parseInt(ship))
            console.log(data)
            }
        })
}

// function placeOrder() {
//     var voucher = document.getElementById('cart-promocode').value
//     var note =document.getElementById('order-comments').value
//     var paymentOption = document.querySelector('input[name="payment"]:checked').value;
//     var stringify = JSON.stringify({voucher,paymentOption,note})
//     console.log(stringify)
//     fetch('http://localhost:3000/checkout', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: stringify
//     }).then((res)=>{
//         return res.json()
//     })
//     .then((data)=>{
//     //     if(data.status==1)
//     //         // window.location.href='/payment/success'
//     // }
// })
   
// }