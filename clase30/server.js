const express = require("express")
const session = require("express-session")
const path = require("path");
const exphbs = require("express-handlebars")
const MongoStore = require("connect-mongo")
const cookieParser = require('cookie-parser')
const passport = require("passport")
const parseArgs = require("minimist")
const cluster = require('cluster');

const numCPUs = require('os').cpus().length

const config = require("./src/utils/config")

const options = {
	default: {
		port: '8080',
		modo: 'FORK'
	}
}
const args = parseArgs(process.argv.slice(2), options)
const port = args.port
const modo = (args.modo).toUpperCase()

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
app.use(express.static("public"))

app.set('views', path.join(path.dirname(''), './public/views'))
app.engine('.hbs', exphbs.engine({
	defaultLayout: 'main',
	layoutsDir: path.join(app.get('views'), 'layouts'),
	extname: '.hbs'
}));
app.set('view engine', '.hbs');


app.use(cookieParser());
app.use(session({
	store: MongoStore.create({
		mongoUrl: config.mongoRemote.cnxStr
	}),
	secret: config.mongoRemote.clave,
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
const ContenedorArchivo = require('./src/contenedores/ContenedorArchivo');
const {
	parse
} = require("path");
const {
	process_params
} = require("express/lib/router");

const contenedorProductos = new ContenedorSql(knexMySQL, 'products')
const contenedorMessages = new ContenedorArchivo('./public/data/messages.json')


io.on('connection', async socket => {
	console.log('Nuevo cliente.')

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

if (modo === 'CLUSTER') {
	if (cluster.isMaster) {
		console.log(`Número de CPU: ${numCPUs}`)
		console.log(`PID MASTER ${process.pid}`)

		for (let i = 0; i < numCPUs; i++) {
			cluster.fork()
		}

		cluster.on('exit', worker => {
			console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
			cluster.fork()
		})
	} else {
		const connectedServer = httpServer.listen(port, function () {
			console.log(`Servidor escuchando puerto ${connectedServer.address().port}, modo: ${modo} - PID: ${process.pid}`)
		})
		connectedServer.on('error', error => console.log(`Error en servidor: ${error}`))
	}
} else {

	const connectedServer = httpServer.listen(port, function () {
		console.log(`Servidor escuchando puerto ${connectedServer.address().port}, modo: ${modo} - PID: ${process.pid}`)
	})
	connectedServer.on('error', error => console.log(`Error en servidor: ${error}`))
	process.on('exit', (code) => {
		console.log('Exit code -> ', code)
	})
}