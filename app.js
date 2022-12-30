var express = require('express')
var app = express()
var session = require('express-session')
var mongoose = require('mongoose')
var routes = require('./routes/index')
var dotenv = require('dotenv')
var cookieParser = require('cookie-parser')
var connect = require('./config/connectDB')
const bodyParser = require('body-parser')



app.use(cookieParser())


dotenv.config()
// mongoose.connect('mongodb://localhost:27017/ecommerce')
app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: true,
}))

app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next(); // Do nothing with the body because I need it in a raw state.
  } else {
    express.json()(req, res, next);  // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
  }
});

app.use(express.urlencoded({ extended: false }))
// app.use(express.json())



app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    req.session.destroy();
  }
  next()

})

app.use(express.static(__dirname + '/public/'))

app.set('view engine', 'ejs')

// app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(spec))


routes(app)

app.listen(process.env.PORT || 3000, function () {
  console.log('listen at port 3000')
})