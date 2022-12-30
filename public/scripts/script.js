// init Isotope
var $grid = $('.collection-list').isotope({
  // options
});
// filter items on button click
$('.filter-button-group').on('click', 'button', function () {
  var filterValue = $(this).attr('data-filter');
  resetFilterBtns();
  $(this).addClass('active-filter-btn');
  $grid.isotope({ filter: filterValue });
});

var filterBtns = $('.filter-button-group').find('button');
function resetFilterBtns() {
  filterBtns.each(function () {
    $(this).removeClass('active-filter-btn');
  });
}

//--------------product-----------
$(".product-content-right-bottom-content-title-item").click(function () {
  $(".product-content-right-bottom-content-details").show();
  $(".product-content-right-bottom-content-sizing").hide();
  $(".product-content-right-bottom-content-care").hide();
});







const details = document.querySelector(".details")
const sizing = document.querySelector(".sizing")
const care = document.querySelector(".care")
if (details) {
  details.addEventListener("click", function () {
    document.querySelector(".product-content-right-bottom-content-details").style.display = "none"
    document.querySelector(".product-content-right-bottom-content-sizing").style.display = "block"
    document.querySelector(".product-content-right-bottom-content-care").style.display = "block"
  })
}
if (sizing) {
  sizing.addEventListener("click", function () {
    document.querySelector(".product-content-right-bottom-content-details").style.display = "block"
    document.querySelector(".product-content-right-bottom-content-sizing").style.display = "none"
    document.querySelector(".product-content-right-bottom-content-care").style.display = "block"
  })
}
if (care) {
  care.addEventListener("click", function () {
    document.querySelector(".product-content-right-bottom-content-details").style.display = "block"
    document.querySelector(".product-content-right-bottom-content-sizing").style.display = "block"
    document.querySelector(".product-content-right-bottom-content-care").style.display = "none"
  })
}


function incrementValue(e) {
  e.preventDefault();
  var fieldName = $(e.target).data('field');
  var parent = $(e.target).closest('div');
  var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

  if (!isNaN(currentVal)) {
    parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
  } else {
    parent.find('input[name=' + fieldName + ']').val(0);
  }
}

function decrementValue(e) {
  e.preventDefault();
  var fieldName = $(e.target).data('field');
  var parent = $(e.target).closest('div');
  var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

  if (!isNaN(currentVal) && currentVal > 1) {
    parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
  } else {
    parent.find('input[name=' + fieldName + ']').val(1);
  }
}

$('.input-group').on('click', '.button-plus', function (e) {
  incrementValue(e);
});

$('.input-group').on('click', '.button-minus', function (e) {
  decrementValue(e);
});



var root_color = document.getElementById('size')
var item = JSON.parse(localStorage.getItem('item'))
var sizeList = item.classify.map((e) => {
  return e.size
}).filter((value, index, self) => {
  return self.indexOf(value) == index;
})
//render button color
sizeList.forEach((s, index) => {

  var btn = document.createElement('button')
  btn.className = 'btn btn-primary btn-sm size-option'
  btn.innerText = s
  btn.onclick = () => {
    // console.log(btn)
    // var optionSize = document.createAttribute('data-size-option')
    // optionSize.value = s
    // console.log(optionSize)
    btn.setAttribute('data-size-option', s)
  }
  root_color.appendChild(btn)
})
var addclass = 'bounder-color';
var $cols = $('.size-option').click(function (e) {
  $cols.removeClass(addclass);
  $cols.removeClass('size');
  $(this).addClass(addclass)
  $(this).addClass('size')

});
document.getElementById('description').innerText=item.description

var rootSize = document.getElementById('color')

var colorList = item.classify.map((e) => {
  return e.color
}).filter((value, index, self) => {
  return self.indexOf(value) == index
})

colorList.forEach((c) => {
  var btn = document.createElement('button')
  btn.className = 'btn btn-primary btn-sm color-option'
  btn.innerText = c
  btn.onclick = () => {
    btn.setAttribute('data-color-option', c)
  }
  rootSize.appendChild(btn)
})


var $cols2 = $('.color-option').click(function (e) {
  console.log($cols2)
  $cols2.removeClass(addclass);
  $cols2.removeClass('color');

  $(this).addClass(addclass)
  $(this).addClass('color')

});



function addToCart() {

  

  var itemInfo = JSON.parse(localStorage.getItem('item'))
  var quantity = document.getElementById('value-quantity').value
  quantity = parseInt(quantity)
  console.log(quantity)
  var { id, name, price, img,volume } = itemInfo
  var size, color
  var colorOption = document.querySelector('.color')
  var sizeOption = document.querySelector('.size')
  if (colorOption == undefined || sizeOption == undefined) {
    document.getElementById('alert').innerHTML = `
    <div class="alert alert-danger" id="success-alert" >
    <strong>*Please choose size and color
    </strong> 
  </div>
    `

    $(".alert").delay(4000).slideUp(200, function () {
      $(this).alert('close');
    });
    return
  }
  size = sizeOption.dataset.sizeOption
  color = colorOption.dataset.colorOption

  // var cartInfo = localStorage.getItem('cart')
  // cartInfo = cartInfo == null ? [] : JSON.parse(localStorage.getItem('cart'))

  var cart ={id,size,color,quantity,price}
  fetch('http://localhost:3000/cart',{
    method:'POST',
    headers:{
      'Content-type':'application/json'
    },
    body:JSON.stringify({cart:cart})
  }).then((res)=>{
    return res.json()
  })
  .then((data)=>{
    console.log(data)
    if(data.status==1){
      document.getElementById('alert').innerHTML = `
      <div class="alert alert-success" id="success-alert">
      <strong>Success! </strong> Product have added to your cart.
    </div>`
  
      $(".alert").delay(4000).slideUp(200, function () {
        $(this).alert('close');
      });
    }
    else if(data.err=1){
      document.getElementById('alert').innerHTML = `
      <div class="alert alert-danger" id="success-alert" >
      <strong>*Please login to use service
      </strong> 
    </div>
      `
  
      $(".alert").delay(4000).slideUp(200, function () {
        $(this).alert('close');
      });
    }
  })



  // var itemInCart = 0
  // for (var i = 0; i < cartInfo.length; i++) {
  //   if (cartInfo[i].id == id && cartInfo[i].size == size && cartInfo[i].color == color) {
  //     cartInfo[i].quantity += quantity
  //     console.log(cartInfo[i].quantity)
  //     itemInCart += 1
  //     break
  //   }
  // }
  // if (itemInCart) {
    // localStorage.setItem('cart', JSON.stringify(cartInfo))
   
  //   return
  // }

  // cartInfo.push({
  //   id, name, price, img: img.cover, size, color, quantity,volume
  // })
  // localStorage.setItem('cart', JSON.stringify(cartInfo))
  //success alert
//   document.getElementById('alert').innerHTML = `
//   <div class="alert alert-success" id="success-alert">
//   <strong>Success! </strong> Product have added to your cart.
// </div>`

//   $(".alert").delay(4000).slideUp(200, function () {
//     $(this).alert('close');
//   });
}


function checkIsUpdate(e) {
  e.preventDefault()
}


