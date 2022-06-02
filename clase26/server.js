const express = require("express")
const session = require("express-session")
const path = require("path");
const exphbs = require("express-handlebars")
const MongoStore = require("connect-mongo")
const cookieParser = require('cookie-parser')
const passport = require("passport")


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

// Motor de plantillas 
app.set('views', path.join(path.dirname(''), './public/views') )
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');


//Session Setup
app.use(cookieParser());
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

app.use(passport.initialize());
app.use(passport.session());

const {
	knexMySQL
} = require('./options/dbMySQL');
const {
	knexSqlite
} = require('./options/SQLite3');

const ContenedorSql = require('./src/contenedores/ContenedorSQL')
const ContenedorArchivo = require('./src/contenedores/ContenedorArchivo')

const contenedorProductos = new ContenedorSql(knexMySQL, 'products')
const contenedorMessages = new ContenedorArchivo('./public/data/messages.json')

// Servidor
io.on('connection', async socket => {
	console.log('Un cliente se ha conectado.')

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

//Enrutamiento API
app.use('/api/productos', productosRouter)
app.use('/api/productos-test', productosTestRouter)

//Enrutamiento Web
app.use('', autenticacionRouter)
/* app.use('', homeRouter)
 */
app.use(middlewares.errorHandler)
app.use(middlewares.ruteNotFound)

const PORT = 8080
const connectedServer = httpServer.listen(PORT, function () {
	console.log(`Servidor escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor: ${error}`))