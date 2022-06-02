const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const schema = normalizr.schema;
const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'mail'})
const schemaMensaje = new schema.Entity('mensaje', { author: schemaAuthor }, { idAttribute: 'id'})
const schemaMensajes = new schema.Entity('mensajes', { mensajes: [schemaMensaje] }, { idAttribute: 'id' })

const normalizarMensajes = (messages) => normalize({ id: 'mensajes', mensajes: messages}, schemaMensajes )

module.exports = { normalizarMensajes }