const express = require('express')
const { Router } = express
// cargo el modulo handlebars
const handlebars = require("express-handlebars")

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/static', express.static(__dirname + '/public'))

// Configuro handlebars 
app.engine('hbs',handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'index.hbs'
})
)

const productosRouter = Router()

app.set('views', './views');


const Contenedor = require('./src/ContenedorProductos')
const productosApi = new Contenedor()

//Endpoints



app.get('/', (req, res) => {
    const productos = productosApi.getAll()
    res.render('formulario.hbs', productos);
})


productosRouter.get('/', (req, res) => {    
   const productos = productosApi.getAll()
   res.render('vistaProductos.hbs',{productos} );
})

productosRouter.get('/:id', (req, res, next) => {
    const busqueda = productosApi.getById(req.params.id)
    if (!busqueda) next({ error: 'Producto no encontrado.' })
    res.send( busqueda );
})

productosRouter.post('/', (req, res) => {
    const newProduct = productosApi.save(req.body)
    console.log(newProduct)
    res.redirect('/');
})

productosRouter.put('/:id', (req, res) => {
    const nuevaLista = productosApi.modifyById(req.body)
    if (nuevaLista == undefined) {
        return res.status(404).send({ error: 'Producto no encontrado.' })
    }
    else listaProductos = nuevaLista
    res.send({status: 'OK'})
})


productosRouter.delete('/:id', (req, res) => {
    const nuevaLista = productosApi.deleteById(req.body.id)
    if (nuevaLista == undefined) {
        return res.status(404).send({ error: 'Producto no encontrado.' })
    }
    else listaProductos = nuevaLista
    res.send({status: 'OK'})
})

app.use('/productos', productosRouter)  



app.use(function (err, req, res, next) {
    res.status(err.status || 500).send(err)
})


const server = app.listen(8080, () => { 
    console.log(`Server escuchando al puerto: ${server.address().port}`) } )

server.on('error', error => console.log(`Error en el servidor ${error}`))