const express = require("express")
const router = express.Router()
const apiProductos = require('../api/apiProductos')
const middlewares = require('../utils/middlewares')
const validations = require('../utils/validations')

router.get("/", apiProductos.getProducts)
router.get("/:id", apiProductos.getProduct)
router.post("/", middlewares.isAdmin, validations.validate(validations.validationProduct), apiProductos.saveProduct)
router.put("/:id", middlewares.isAdmin, validations.validate(validations.validationProduct), apiProductos.updateProdById)
router.delete("/:id", middlewares.isAdmin, apiProductos.deleteProduct)

module.exports = router;