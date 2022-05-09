require('dotenv').config()

let config = {
  port: process.env.PORT,
  dev: process.env.NODE_ENV !== 'production',
}


let sockets = {
  port: process.env.PORT,
  dev: process.env.NODE_ENV !== 'production',
}

let database = {
  mongo_atlas_uri: process.env.MONGO_ATLAS_URI
}