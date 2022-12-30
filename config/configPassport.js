var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const fetch = require('node-fetch');

function config(){
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/userinfo"
      },
      function(accessToken, refreshToken, profile, cb) {
        profile.accessToken=accessToken
        return cb(null, profile);
      }
    ));
    passport.serializeUser(function (user, done) {
      var URL=`https://people.googleapis.com/v1/people/${user.id}?personFields=birthdays,genders,phoneNumbers&access_token=${user.accessToken}`
      fetch(URL)
      .then((res)=>{
        return res.json()
      })
      .then((data)=>{
        user.gender=data.genders[0].value
        user.dob=`${data.birthdays[0].date.day}-${data.birthdays[0].date.month}-${data.birthdays[0].date.year}`
        return user
      })
      .then((user)=>{
        return done(null,user)
      })
    })
    
    passport.deserializeUser(function (user, done) {
        return done(null, user)
    })
    
}

module.exports=config
