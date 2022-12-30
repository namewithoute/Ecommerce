
function filInfor(email,phone,address,name){
    document.getElementById('email').value=email
    document.getElementById('phone').value=phone
    document.getElementById('address').value=address
    document.getElementById('name').value=name
}


function filInforAdmin(email,phone,name){
    document.getElementById('emailAdmin').value=email
    document.getElementById('phoneAdmin').value=phone
    document.getElementById('nameAdmin').value=name

}

async function submitEditUser(){
    var email=document.getElementById('email').value
    var option=document.getElementById('sel1').value
    try{
        var fetchToServer=await fetch('http://localhost:3000/admin/accounts',{
            method:"PUT",
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({email,option})
        })
        res= await fetchToServer.json()
        if(res.status==1)
        window.location.href='/admin/accounts'
        else
        console.log(res)
    }
  catch(e){
    console.log(e)
  }
}


async function submitEditAdmin(){
    var email=document.getElementById('emailAdmin').value
    var name=document.getElementById('nameAdmin').value
    if(name.split(' ').length ==1){
        alert('Please enter first name and last name')
        return 
    }
    var firstName = name.split(' ')[0]
    var lastName = name.split(' ')[1]
    console.log(firstName,lastName)
    var phone = document.getElementById('phoneAdmin').value
    var option=document.getElementById('sel1Admin').value
    try{
        var fetchToServer=await fetch('http://localhost:3000/admin/accounts',{
            method:"PUT",
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({email,phone,firstName,lastName,option,type:'admin'})
        })
        res= await fetchToServer.json()
        if(res.status==1)
        window.location.href='/admin/accounts'
        else
        console.log(res)
    }
  catch(e){
    console.log(e)
  }
}



async function submitNewAcc(){
    var firstName=document.getElementById('firstNameAdd').value
    var lastName=document.getElementById('lastNameAdd').value
    var email=document.getElementById('emailAdd').value
    var phone=document.getElementById('phoneAdd').value
    var password=document.getElementById('passwordAdd').value
    var role =document.getElementById('sel1Add').value

    var sendToServer= await fetch('http://localhost:3000/admin/accounts',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({firstName,lastName,email,phone,role,password})
    })
    var res= await sendToServer.json()
    console.log(res)
    if(res.status==0){
        document.getElementById('alert').innerText=res.message
        document.getElementById('alert').style.display='block'
    }
    else{
        window.location.href='/admin/accounts'
    }
}


async function deleteAcc(email){
    console.log(email)
    var alert1=confirm('Are you sure want to delete '+email+' account')
    console.log(alert1)
    if(alert1){
        var deleteAcc =await fetch('http://localhost:3000/admin/accounts',{
            method:'DELETE',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({email:email})
        })
        var res=await deleteAcc.json()
        if(res.status==1){
            window.location.href='/admin/accounts'
        }
    }
}