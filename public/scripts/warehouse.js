function itemData(itemID) {
    console.log(itemID)
}

var itemList = JSON.parse(JSON.parse(localStorage.getItem('warehouse')))


var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',

})
var stringHTML = ''
for (var i = 0; i < itemList.length; i++) {
    stringHTML += `  <tr>
    <td>${i + 1}</td>
    <td>${itemList[i].id}</td>
    <td><img width="50px" height="50px" style="margin-right: -100px;"
            src="${itemList[i].img.cover}"></td>
    <td>${itemList[i].name}</td>
    <td>${formatter.format(itemList[i].price)}</td>
    <td>${itemList[i].brand || ''}</td>
    <td>${itemList[i].type || ''}</td>

    <td> <button class="btn btn1" href="#myModal" onclick="itemData('${itemList[i].id}')" data-toggle="modal">Edit</button>
        <button class="btn btn2" onclick="submitDelete('${itemList[i].id}')">Delete</button>
    </td>
</tr>`
}

document.getElementById("container").innerHTML = stringHTML

function fillIntoForm(item) {
    let stringHTML = ''
    for (var i = 0; i < item.classify.length; i++) {
        stringHTML += ` <div class="row item-option">
        <div class="form-floating col-sm-4">
            <label for="Size">Size</label>
            <input type="text" max="3"class="form-control" id="size" value=${item.classify[i].size} >                                                         
        </div>
        <div class="form-floating col-sm-4">
            <label for="color">Color</label>
            <input type="text" class="form-control" id="color" value=${item.classify[i].color} >                                                         
        </div>
        <div class="form-floating col-sm-4">
            <label for="Quantily">Quantity</label>
            <input type="number" class="form-control" id="quantity" value=${item.classify[i].quantity} >                                                         
        </div>
    </div> `
    }
    document.getElementById('detail').innerHTML = stringHTML


    document.getElementById('id').value = item.id

    document.getElementById('name').value = item.name
    document.getElementById('price').value = item.price || ''
    document.getElementById('brand').value = item.brand || ''
    document.getElementById('type').value = item.type || ''
    document.getElementById('evaluate').value = item.evaluate

    document.getElementById('height').value = item.volume.height
    document.getElementById('width').value = item.volume.width
    document.getElementById('length').value = item.volume.length
    document.getElementById('weight').value = item.volume.weight
    document.getElementById('description').value = item.description || ''

}


function createNewOption() {
    var div = document.createElement('div')
    div.className = 'row item-option'
    div.innerHTML = `
    <div class="form-floating col-sm-4">
        <label for="Size">Size</label>
        <input type="text" max="3"class="form-control" id="size" >                                                         
    </div>
    <div class="form-floating col-sm-4">
        <label for="color">Color</label>
        <input type="text" class="form-control" id="color" >                                                         
    </div>
    <div class="form-floating col-sm-4">
        <label for="Quantily">Quantity</label>
        <input type="number" class="form-control" id="quantity">                                                         
</div> `
    document.getElementById('detail').appendChild(div)
}


function createNewOptionAdd() {
    var div = document.createElement('div')
    div.className = 'row item-option-add'
    div.innerHTML = `
    <div class="form-floating col-sm-4">
        <label for="Size">Size</label>
        <input type="text" max="3"class="form-control" id="size" >                                                         
    </div>
    <div class="form-floating col-sm-4">
        <label for="color">Color</label>
        <input type="text" class="form-control" id="color" >                                                         
    </div>
    <div class="form-floating col-sm-4">
        <label for="Quantily">Quantity</label>
        <input type="number" class="form-control" id="quantity">                                                         
</div> `
    document.getElementById('detailAdd').appendChild(div)
}




function itemData(id) {
    var itemData
    itemList.forEach((item) => {
        if (item.id == id)
            itemData = item
        return
    })
    fillIntoForm(itemData)
}

async function submitEdit() {

    //get detail item
    var listOption = document.querySelectorAll('.item-option')
    var list = []
    listOption.forEach((optionValue) => {
        list.push(optionValue.children)
    })

    var listValue = []
    list.forEach((tag) => {
        var obj = {}
        for (i = 0; i < tag.length; i++) {
            let key = tag[i].getElementsByTagName('input')[0].getAttribute('id')
            let value = tag[i].getElementsByTagName('input')[0].value
            obj[key] = value

        }
        listValue.push(obj)
    })


    listValue = listValue.filter((value) => {
        return (value.size != '' && value.color != '' && value.quantity != '')
    })

    var id = document.getElementById('id').value
    var name = document.getElementById('name').value
    var price = document.getElementById('price').value
    var brand = document.getElementById('brand').value
    var type = document.getElementById('type').value
    var evaluate = document.getElementById('evaluate').value
    var height = document.getElementById('height').value
    var width = document.getElementById('width').value
    var length = document.getElementById('length').value
    var weight = document.getElementById('weight').value
    var description = document.getElementById('description').value

    var dataText = {id, name, price, brand, type, evaluate, height, weight, width, length, description, listValue}


    var formData = new FormData()
    var imgCover = document.getElementById('imgCoverEdit')
    var imgDetail = document.getElementById('imgDetailEdit')
    formData.append('files',imgCover.files[0])

    for (let i = 0; i < imgDetail.files.length; i++) {
        formData.append("files", imgDetail.files[i]);
    }
    formData.append('dataText', JSON.stringify(dataText))
    var sendToServer = await fetch('http://localhost:3000/admin/warehouse',{
        method:'PUT',
        body:formData
    })
    var res= await sendToServer
    if(res.status==0){
        alert(res.message)
    }
    else{
        window.location.href='/admin/warehouse'
    }
}



async function submitAddNew() {

    //get detail item
    var listOption = document.querySelectorAll('.item-option-add')
    var list = []
    listOption.forEach((optionValue) => {
        list.push(optionValue.children)
    })
    var listValue = []
    list.forEach((tag) => {
        var obj = {}
        for (i = 0; i < tag.length; i++) {
            let key = tag[i].getElementsByTagName('input')[0].getAttribute('id')
            let value = tag[i].getElementsByTagName('input')[0].value
            obj[key] = value

        }
        listValue.push(obj)
    })
    listValue = listValue.filter((value) => {
        return (value.size != '' && value.color != '' && value.quantity != '')
    })
    if(listValue.length==0){
        alert('Please add item detail')
        return
    }

    var id = document.getElementById('idAdd').value
    var name = document.getElementById('nameAdd').value
    var price = document.getElementById('priceAdd').value
    var brand = document.getElementById('brandAdd').value
    var type = document.getElementById('typeAdd').value
    var evaluate = document.getElementById('evaluateAdd').value
    var height = document.getElementById('heightAdd').value
    var width = document.getElementById('widthAdd').value
    var length = document.getElementById('lengthAdd').value
    var weight = document.getElementById('weightAdd').value
    var description = document.getElementById('descriptionAdd').value

    var dataText = {id, name, price, brand, type, evaluate, height, weight, width, length, description, listValue}

    var formData = new FormData()
    var imgCover = document.getElementById('imgCoverAdd')
    var imgDetail = document.getElementById('imgDetailAdd')
    formData.append('files',imgCover.files[0])

    for (let i = 0; i < imgDetail.files.length; i++) {
        formData.append("files", imgDetail.files[i]);
    }
    formData.append('dataText', JSON.stringify(dataText))
    var sendToServer = await fetch('http://localhost:3000/admin/warehouse',{
        method:'POST',
        body:formData
    })
    var res = await sendToServer.json()
    if(res.status==0){
        document.getElementById('alertID').style.display='block'
    }
    else{
        window.location.href='/admin/warehouse'
    }
}


async function submitDelete(id){
    if(confirm('Are you sure want delete '+id +' item')){
    var send=await fetch('http://localhost:3000/admin/warehouse',{
        method:'DELETE',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({
            id
        })
    })
    var res = await send.json()
    if(res.status==1){
        window.location.href='/admin/warehouse'
    }
}

}