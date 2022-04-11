const express = require('express')
const { Router } = express

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static(__dirname + '/public'))

const productosRouter = Router()

// Ubicación de las plantillas
app.set('views', './views');

app.set('view engine', 'pug');

const Contenedor = require('./src/ContenedorProductos')
const productosApi = new Contenedor()

// Endpoints

app.get('/', (req, res) => {
    const productos = productosApi.getAll()
    res.render('formulario', { productos });
})

// Muestro los productos
productosRouter.get('/', (req, res) => {
    const productos = productosApi.getAll()
    res.render('vistaProductos', { productos } );
})

// Devuelvo un producto por su id
productosRouter.get('/:id', (req, res, next) => {
    const busqueda = productosApi.getById(req.params.id)
    if (!busqueda) next({ error: 'Producto no encontrado.' })
    res.send( busqueda );
})

// Agrego un producto y lo devuelvo con id
productosRouter.post('/', (req, res) => {
    const newProduct = productosApi.save(req.body)
    console.log(newProduct)
    res.redirect('/');
})

// Recibo y actualizo un producto según su id
productosRouter.put('/:id', (req, res) => {
    const nuevaLista = productosApi.modifyById(req.body)
    if (nuevaLista == undefined) {
        return res.status(404).send({ error: 'Producto no encontrado.' })
    }
    else listaProductos = nuevaLista
    res.send({status: 'OK'})
})

// Elimino un producto según su id
productosRouter.delete('/:id', (req, res) => {
    const nuevaLista = productosApi.deleteById(req.body.id)
    if (nuevaLista == undefined) {
        return res.status(404).send({ error: 'Producto no encontrado.' })
    }
    else listaProductos = nuevaLista
    res.send({status: 'OK'})
})

// Agrego enrutamiento
app.use('/productos', productosRouter)  


// Middleware manejo de errores
app.use(function (err, req, res, next) {
    res.status(err.status || 500).send(err)
})


const server = app.listen(8080, () => { 
    console.log(`Server escuchando al puerto ${server.address().port}`) } )

server.on('error', error => console.log(`Error en el servidor ${error}`))