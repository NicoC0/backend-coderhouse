const express = require('express')
const app = express()
const { faker } = require('@faker-js/faker');
PORT = 8080
app.listen(PORT,() => {console.log(`Server on en puerto ${PORT}`)})
faker.locale = 'es'
app.use(express.json())
app.use(express.urlencoded({extended: true}))
let serverRoutes = require('./components/users')

serverRoutes(app)