const express = require("express")
const {Server: HttpServer} = require("http")

const {Server: IOServer} = require("socket.io")

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer) 
const productosRouter = require('./src/routers/productosRouter')
const productosTestRouter = require('./src/routers/productosTestRouter')

//  Normalizr 
const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static("public"))

const {knexMySQL} = require('./options/dbMySQL');


const Contenedor = require('./src/Contenedor')
const ContenedorMensajes = require('./src/ContenedorMensajes')

const contenedorProductos = new Contenedor(knexMySQL, 'products')
const contenedorMessages = new ContenedorMensajes('./public/data/messages.json')

// Autor
const schemaAuthor = new schema.Entity('author', {}, {
	idAttribute: 'mail'
})
// Mensaje
const schemaMensaje = new schema.Entity('mensaje', {
	author: schemaAuthor
}, {
	idAttribute: 'id'
})
// Mensajes
const schemaMensajes = new schema.Entity('mensajes', {
	mensajes: [schemaMensaje]
}, {
	idAttribute: 'id'
})

io.on('connection', async socket => {
	console.log('Cliente nuevo conectado')

	contenedorProductos.getAll().then(result => {
		if (result.status === "success") {
			socket.emit('products', result.payload)
		}
	})

	let messages = await contenedorMessages.getMessages();
	let messagesNormalizr = normalize(messages, schemaMensajes)
	socket.emit('messages', messagesNormalizr)

	socket.on('newMessage', async message => {
		await contenedorMessages.saveMessages(message)
		let messages = await contenedorMessages.getMessages()
		const messagesId = {
			id: "mensajes",
			mensajes: [messages]
		}
		let messagesNormalizr = normalize(messagesId, schemaMensajes)
		io.sockets.emit('messages', messagesNormalizr)
	})
})

app.use('/api/productos', productosRouter)
app.use('/api/productos-test', productosTestRouter)

const PORT = 8080
const connectedServer = httpServer.listen(PORT, function () {
	console.log(`Servidor escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor: ${error}`))