module.exports = {
    PORT: process.env.PORT || 8080,
    mongoLocal: {
        client: 'mongodb',
        cnxStr: 'mongodb://localhost:27017/ecommerce'
    },
    mongoRemote: {
        client: 'mongodb',
        cnxStr: 'mongodb+srv://nico:nico@nico-cluster.dvkg2.mongodb.net/?retryWrites=true&w=majority'
    }
}