module.exports = {
    PORT: process.env.PORT || 8080,
    mongoLocal: {
        client: 'mongodb',
        cnxStr: 'mongodb://localhost:27017/ecommerce'
    },
    firebase: {
        serviceAccount: './db/coderhouseback-firebase-adminsdk-u6es2-9a32528919.json',
        databaseURL: 'https://coderhouseback.firebaseio.com'
    },
    archivos: {
        path: './DB'
    }
}