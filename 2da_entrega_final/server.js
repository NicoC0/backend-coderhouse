const config = require('./config.js')
const express = require("express")
const app = express()
const {
	Server: HttpServer
} = require("http")
const httpServer = new HttpServer(app)
const middlewares = require('./src/utils/middlewares')

require('dotenv').config()

const productosRouter = require('./src/routers/productos')
const carritoRouter = require('./src/routers/carrito')

app.use('/static', express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))

// Router
app.use('/api/productos', productosRouter)
app.use('/api/carrito', carritoRouter)

// Middlewares
app.use(middlewares.errorHandler)
app.use(middlewares.ruteNotFound)

const connectedServer = httpServer.listen(config.PORT, function () {
	console.log(`Servidor escuchando el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en el servidor: ${error}`))