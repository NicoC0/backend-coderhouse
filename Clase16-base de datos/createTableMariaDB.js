const { options} = require ('./options/dbMySQL.js')
const knex = require ('knex')(options);

knex.schema.createTable('products', table => {
    table.increments('id', { primaryKey: true }),
    table.string('title', { length: 15 }).notNullable(),
    table.string('thumbnail'); 
    table.decimal('price');
  }).then(()=> {
      console.log('Tabla creada')
  }).catch((err)=>{
      console.log(err)
      throw err 
  }).finally(() => {
      knex.destroy(); 
  })
  