const ContenedorMemoria = require('../../contenedores/ContenedorMemoria')


module.exports = class ProductosDaoMemoria extends ContenedorMemoria {
    constructor(file) {
        super(file)
    }
}
