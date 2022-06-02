const express = require("express")
const router = express.Router()

//Variable booleana administrador
let administrador = Boolean(true)
//Funcion usuario no autorizado 
noAutorizado = (ruta, metodo) => {
    return {
        error: -1,
        descripcion: `ruta ${ruta}, Método: ${metodo} no autorizado.`
    }
}

const {
    knexMySQL
} = require('../../options/dbMySQL');

const ApiProductosMock = require('../../api/productos.js')
const apiProductos = new ApiProductosMock(knexMySQL, 'products')

router.get('/', async(req, res, next) => {
    try{
        const products = await apiProductos.popular()
        res.json(products)
    }
    catch(error){
        next(error)
    }
}
)
module.exports = router;