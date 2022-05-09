const ContenedorMemoria = require('../../contenedores/ContenedorMemoria')

module.exports = class CarritosDaoMemoria extends ContenedorMemoria {
    constructor(file) {
        super(file)
    }
}
