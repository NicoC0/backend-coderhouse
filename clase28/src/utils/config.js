const dotenv = require("dotenv")
dotenv.config()

const config = {
    administrador: Boolean(true),
    mongoLocal: {
        client: 'mongodb',
        cnxStr: 'mongodb://localhost:27017/ecommerce'
    },
    mongoRemote: {
        client: 'mongodb',
        cnxStr: 'mongodb+srv://nico:nico@nico-cluster.dvkg2.mongodb.net/?retryWrites=true&w=majority',
        clave: 'shhhhhhhhhhhhhhhhhhhhh'
    }
}

module.exports = config