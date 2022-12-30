document.addEventListener("DOMContentLoaded", function(event) {
  
    function OTPInput() {
  const inputs = document.querySelectorAll('#otp > *[id]');
  for (let i = 0; i < inputs.length; i++) { inputs[i].addEventListener('keydown', function(event) { if (event.key==="Backspace" ) { inputs[i].value='' ; if (i !==0) inputs[i - 1].focus(); } else { if (i===inputs.length - 1 && inputs[i].value !=='' ) { return true; } else if (event.keyCode> 47 && event.keyCode < 58) { inputs[i].value=event.key; if (i !==inputs.length - 1) inputs[i + 1].focus(); event.preventDefault(); } else if (event.keyCode> 64 && event.keyCode < 91) { inputs[i].value=String.fromCharCode(event.keyCode); if (i !==inputs.length - 1) inputs[i + 1].focus(); event.preventDefault(); } } }); } } OTPInput();
  
      
  });

function submitOTP(){
  var list=document.querySelectorAll('.rounded')
  var otp=''
  list.forEach((digit)=>{
    otp+=digit.value
  })
  fetch('http://localhost:3000/profile/verify',{
    method:'POST',
    headers:{
      'Content-type':'application/json'
    },
    body:JSON.stringify({otp})
  }).then((res)=>{
    return res.json()
  }).then((data)=>{
    if(data.status==1){
      window.location.href='/profile'
    }
    else{
      document.getElementById('fail').style.display='block'
    }
  })
}