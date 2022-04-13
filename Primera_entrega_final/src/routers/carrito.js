const express = require("express")
const router = express.Router()

const Contenedor = require('../Contenedor')
const contenedorCarrito = new Contenedor('./public/data/carrito.json')

router.get("/", async (req, res) => {
    const todos = await contenedorCarrito.getAll()
        .catch(err => next(err))
    res.send(todos)
})

router.post("/", async (req, res, next) => {
	const cart = {
		productos: []
	}
	const newCarrito = await contenedorCarrito.saveProduct(cart)
	res.send(newCarrito)
})

router.delete("/:id", async (req, res, next) => {

	const buscado = await contenedorCarrito.deleteById(req.params.id)
		.catch(err => next(err))
	if (buscado === null) return res.status(404).send({
		error: 'Carrito no encontrado.'
	})
	else
		res.send({
			status: 'OK'
		})
})

router.get("/:id/productos", async (req, res, next) => {
	try {
		const buscado = await contenedorCarrito.getById(req.params.id)
			.catch(err => next(err))
		if (!buscado) res.status(404).send({
			error: 'Carrito no encontrado.'
		})
		res.send(buscado)
	} catch (err) {
		return next(err)
	}
})

router.post("/:id/productos", async (req, res, next) => {
	const newProduct = await contenedorCarrito.saveCart(req.params.id, req.body)
		.catch(err => next(err))
	res.send({
		status: 'OK'
	})
})


router.delete("/:id/productos/:id_prod", async (req, res) => {
	console.log(req.params.id, req.params.id_prod)
	const buscado = await contenedorCarrito.deleteCartByIdProd(req.params.id, req.params.id_prod)
	if (buscado === null) return res.status(404).send({
		error: 'Carrito/producto no encontrado.'
	})
	else
		res.send({
			status: 'OK'
		})
})

module.exports = router;