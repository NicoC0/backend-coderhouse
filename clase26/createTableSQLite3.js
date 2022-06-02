const { options} = require('./options/SQLite3').default.default
const knex = require ('knex')(options);

knex.schema.createTable('messages', table => {
    table.increments('id'); // valor autoincrementable id
    table.string('email');
    table.date('date');
    table.string('text');
  }).then(()=> {
      console.log('Table messages de SQLite3 created.')
  }).catch((err)=>{
      console.log(err)
      throw err 
  }).finally(() => {
      knex.destroy() 
  })