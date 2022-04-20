const { options} = require('./options/SQLite3').default.default
const knex = require ('knex')(options);

knex.schema.createTable('messages', table => {
    table.increments('id'); // valor autoincrementable id
    table.string('email');
    table.date('date');
    table.string('text');
  }).then(()=> {
      console.log('Tabla creada.')
  }).catch((err)=>{
      console.log(err)
      throw err 
  }).finally(() => {
      knex.destroy() 
  })