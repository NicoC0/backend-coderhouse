const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")

const {
	Server: HttpServer
} = require("http")
/* TP WebSockets */
const {
	Server: IOServer
} = require("socket.io")


const app = express()
const httpServer = new HttpServer(app) 
const io = new IOServer(httpServer) 
const productosRouter = require('./src/routers/productosRouter')
const productosTestRouter = require('./src/routers/productosTestRouter')
const autenticacionRouter = require('./src/routers/web/autenticacionRourter')
const homeRouter = require('./src/routers/web/homeRouter')
const normalizar = require('./src/normalizacion/normalizrMessages')
const middlewares = require('./src/utils/middlewares')

app.use(express.json())
app.use(express.urlencoded({
	extended: true
}))
// Espacio público del servidor
app.use(express.static("public"))

app.set('view engine', 'ejs');

//Session Setup
app.use(session({
	store: MongoStore.create({
		mongoUrl: 'mongodb+srv://nico:nico@nico-cluster.dvkg2.mongodb.net/?retryWrites=true&w=majority'
	}),
	secret: 'shhhhhhhhhhhhhhhhhhhhh',
	resave: true,
	saveUninitialized: false,
	rolling: true,
	cookie: {
		maxAge: 60000
	}
}))


const {
	knexMySQL
} = require('./options/dbMySQL');


const ContenedorSql = require('./src/contenedores/ContenedorSQL')
const ContenedorArchivo = require('./src/contenedores/ContenedorArchivo')

const contenedorProductos = new ContenedorSql(knexMySQL, 'products')
const contenedorMessages = new ContenedorArchivo('./public/data/messages.json')

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


	let messages = await contenedorMessages.getAll();
	let messagesNormalizr = normalizar.normalizarMensajes(messages)
	socket.emit('messages', messagesNormalizr)


	socket.on('newMessage', async message => {
		await contenedorMessages.saveAll(message)
		let messages = await contenedorMessages.getAll()
		let messagesNormalizr = normalizar.normalizarMensajes(messages)
		io.sockets.emit('messages', messagesNormalizr)
	})
})

app.use('/api/productos', productosRouter)
app.use('/api/productos-test', productosTestRouter)

app.use('', autenticacionRouter)
app.use('', homeRouter)

app.use(middlewares.errorHandler)
app.use(middlewares.ruteNotFound)


const PORT = 8080
const connectedServer = httpServer.listen(PORT, function () {
	console.log(`Servidor HTTP con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor: ${error}`))