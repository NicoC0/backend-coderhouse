const express = require("express")
const router = express.Router()
const apiCarritos = require('../api/apiCarritos')

router.get("/", apiCarritos.getCarritos)
router.post("/", apiCarritos.saveNewCarrito)
router.delete("/:id", apiCarritos.deleteCarrito)
router.get("/:id/productos", apiCarritos.getCarrito)
router.post("/:id/productos", apiCarritos.addProdCarrito)
router.delete("/:id/productos/:id_prod", apiCarritos.deleteProdCarrito)

module.exports = router;