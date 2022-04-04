const express = require("express")
const { Server: HttpServer } = require("http")
const { Server: IOServer } = require("socket.io")

const app = express()
const httpServer = new HttpServer(app) 
const io = new IOServer(httpServer) 

app.use(express.static("public"))

const Contenedor = require('./src/Contenedor')
const contenedorProductos = new Contenedor('./public/data/products.json')
const contenedorMessages = new Contenedor('./public/data/messages.json')


io.on('connection', async socket => {
	console.log('Se detectó una nueva conexión')

	// Muestro los productos al usuario conectado
	let products = await contenedorProductos.getAll()
	socket.emit('products', products)

	// Atento a los cambios y los envío de nuevo
	socket.on('newProduct', async product => {
		await contenedorProductos.saveProduct(product)
		let products = await contenedorProductos.getAll()
		io.sockets.emit('products', products)
	})

	// Muestro al cliente la lista de mensajes
	let messages = await contenedorMessages.getAll();
	socket.emit('messages', messages)

	// Escucho los mensajes y envío los nuevos
	socket.on('newMessage', async message => {
		await contenedorMessages.saveProduct(message)
		let messages = await contenedorMessages.getAll()
		io.sockets.emit('messages', messages)
	})

})

const PORT = 8080
const connectedServer = httpServer.listen(PORT, function () {
	console.log(`Servidor escuchando al puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en el servidor: ${error}`))
