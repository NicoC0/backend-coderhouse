const express = require("express")
const {
	Server: HttpServer
} = require("http")
const {
	Server: IOServer
} = require("socket.io")

const app = express()
const httpServer = new HttpServer(app) 
const io = new IOServer(httpServer) 
const productosRouter = require('./src/routers/productosRouter')

app.use(express.json())
app.use(express.urlencoded({
	extended: true
}))


app.use(express.static("public"))

const {
	knexMySQL
} = require('./options/dbMySQL');
const {
	knexSqlite
} = require('./options/SQLite3');

const Contenedor = require('./src/Contenedor')

const contenedorProductos = new Contenedor(knexMySQL, 'products')
const contenedorMessages = new Contenedor(knexSqlite, 'messages')

io.on('connection', async socket => {
	console.log('Un Cliente se ha Conectado!')

	contenedorProductos.getAll().then(result => {
		if (result.status === "success") {
			socket.emit('products', result.payload)
		}
	})

	socket.on('newProduct', product => {
		contenedorProductos.saveProduct(product)
			.then(result => console.log(result))
			.then(() => {
				contenedorProductos.getAll().then(result => {
					if (result.status === "success") {
						socket.emit('products', result.payload)
					}
				})
			})
	})

	contenedorMessages.getAll().then(result => {
		if (result.status === "success") {
			socket.emit('messages', result.payload)
		}
	})

	socket.on('newMessage', message => {
		contenedorMessages.saveProduct(message)
			.then(result => console.log(result))
			.then(() => {
				contenedorMessages.getAll().then(result => {
					if (result.status === "success") {
						socket.emit('messages', result.payload)
					}
				})
			})
	})
})

app.use('/api/productos', productosRouter)

app.all(/.*$/, function (req, res) {
	res.send({
		error: -2,
		descripcion: `ruta ${req.path}, Método: ${req.method} no implementado.`
	});
});
const PORT = 8080
const connectedServer = httpServer.listen(PORT, function () {
	console.log(`Servidor HTTP con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor: ${error}`))