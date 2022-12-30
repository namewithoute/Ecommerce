require('dotenv').config()
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);

function sendSMS(options){
    var header='+84'

    var phoneFormat=header.concat(options.phone.toString().slice(1,options.phone.length))

    client.messages
    .create({
        body: `Your OTP is: ${options.otp}`,
        from: '+19458003934',
        to: phoneFormat,
      })
    .then(message => console.log(message.sid));
}
module.exports=sendSMS
