
fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
    method: 'GET',
    headers: {
        'Content-type': 'application/json',
        'token': '10fc2278-5f78-11ed-b824-262f869eb1a7'
    }
})
    .then((res) => {
        return res.json()
    })
    .then((provinces) => {
        console.log(provinces)
        renderProvinceOption(provinces)
    })

function getDistrict() {
    var provinceID = document.getElementById('provinceSelect').value
    fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'token': '10fc2278-5f78-11ed-b824-262f869eb1a7'
        },
        body: JSON.stringify({ 'province_id': parseInt(provinceID) })
    }).then((res) => {
        return res.json()
    }).then((districts) => {
        renderDistrictOption(districts)
    })
}

getDistrict()


function getWard() {
    var districtID = document.getElementById('districtSelect').value
    console.log(districtID)
    try {

        fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'token': '10fc2278-5f78-11ed-b824-262f869eb1a7'
            },
            body: JSON.stringify({ 'district_id': parseInt(districtID) })
        }).then((res) => {
            return res.json()
        }).then((wards) => {
            renderWardOption(wards)
            // renderDistrictOption(districts)
        })
    }
    catch (e) {
        console.log(e)
    }
}

getWard()

function renderProvinceOption(provinces) {
    provinces.data.forEach((province) => {
        // console.log(province)
        let option = document.createElement('option')
        option.value = province.ProvinceID
        option.innerText = province.ProvinceName
        document.getElementById('provinceSelect').appendChild(option)
        // let htmlString = `<option value="${province.ProvinceID}">${province.ProvinceName}</option>`
    })
}

function renderDistrictOption(districts) {
    districts.data.forEach((district) => {
        let option = document.createElement('option')
        option.value = district.DistrictID
        option.innerText = district.DistrictName
        document.getElementById('districtSelect').appendChild(option)
    })
}

function renderWardOption(wards) {
    wards.data.forEach((ward) => {
        console.log(ward)
        let option = document.createElement('option')
        option.value = ward.WardCode
        option.innerText = ward.WardName
        document.getElementById('wardSelect').appendChild(option)
    })
}


function onchangeProvince() {
    document.getElementById('districtSelect').innerHTML = ''
    getDistrict()
}
function onchangeDistrict() {
    document.getElementById('wardSelect').innerHTML = ''
    getWard()
}



var originalData = document.querySelectorAll('.fc')
var originalArr = []
originalData.forEach((tag) => {
    if (tag.value == '') {
        var label = document.createElement('p')
        label.className = 'small mb-1'
        label.style.color = '#DD0000'
        var text = document.createTextNode(`*Required`)
        label.appendChild(text)
        tag.parentNode.append(label)
    }
    originalArr.push(tag.value)
})

async function checkIsUpdate(e) {
    //check phone is change


    var dataSubmit = document.querySelectorAll('.fc')
    var submitArr = []
    var submitBody = {}
    var flag = 0
    dataSubmit.forEach((tag) => {
        if (tag.value == '') {
            flag = 1
            return
        }
    })
    if (flag == 1) {
        return
    }
    dataSubmit.forEach((tag) => {
        submitArr.push(tag.value)
        if (tag.tagName == 'SELECT' && tag.name != 'gender') {
            submitBody[tag.name] = {
                name: tag.options[tag.selectedIndex].text,
                ID: tag.value
            }
        } else
            submitBody[tag.name] = tag.value
    })



    var sameArr = JSON.stringify(submitArr) === JSON.stringify(originalArr)
    if (sameArr)
        return

    var originalPhone = originalArr[5]
    var updateData = document.getElementById('inputPhone').value
    if (originalPhone == updateData) {
        delete submitBody['phone']
    }
    console.log(submitBody)


    var res = await fetch('http://localhost:3000/profile', {
        method: 'PUT',
        headers:
        {
            'Content-type': 'application/json',
            // 'Cookie':'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiZmV4ZWMyNTg3NUBob3hkcy5jb20iLCJyb2xlIjoxLCJpc1ZlcmlmeSI6ZmFsc2V9LCJpYXQiOjE2NjgwMDA0MTF9.ERdd2ViJ_y76iPJNw4jYkBCCb3AJUn8FHumjkkR7RO4'
        },
        body: JSON.stringify({ dataUpdate: submitBody })
    })
    var data = await res.json()
    if (data.status == 1) {
        window.location.href = 'http://localhost:3000/profile'
    }
    else if (data.status == 0) {
        document.getElementById('phoneAlert').innerHTML = data.message
    }
}


function reqVerify(){
    fetch('http://localhost:3000/verify/create-otp',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        }
    })
}