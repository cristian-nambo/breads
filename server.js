const express = require('express')
const app = express()
const methodOverride = require('method-override')
const mongoose  = require('mongoose')



// CONFIGURATION
require('dotenv').config()
const PORT = process.env.PORT
console.log(PORT)

//ROUTES
app.get('/', (req, res) => {
    res.send('Welcome to an Awesome App about Breads!')
})

mongoose.connect(process.env.MONGO_URI, 
    {useNewUrlParser: true, useUnifiedTopology: true}, () => {
        console.log('connected to mongoDB: ', process.env.MONGO_URI)
    })
  
// Breads //// Middleware
const breadsController = require('./controllers/breads_controller.js')
app.use(methodOverride('_method'))
app.use('/breads', breadsController)
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('views', __dirname + '/views')
app.set('view engine', 'jsx')
app.engine('jsx', require('express-react-views').createEngine())


// 404 Page
app.get('*', (req, res) => {
    res.send('Error 404')
})

//LISTEN
app.listen(PORT, () => {
    console.log('Listening on port', PORT)
})
