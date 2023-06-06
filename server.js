const express = require('express')
const app = express()
const methodOverride = require('method-override')



// CONFIGURATION
require('dotenv').config()
const PORT = process.env.PORT
console.log(PORT)

//ROUTES
app.get('/', (req, res) => {
    res.send('Welcome to an Awesome App about Breads!')
})

// Breads
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
