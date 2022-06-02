const knexSqlite = {
    client: 'sqlite3',
    connection: {
        filename: `${__dirname}/DB/ecommerce.sqlite`
    },
    useNullAsDefault: true
}

const knex = require('knex')(knexSqlite)

knex.schema.hasTable('messages')
    .then(result => {
        if (!result) {
            knex.schema.createTable('messages', table => {
                table.increments('id', {
                    primaryKey: true
                });
                table.string('email').notNullable(),
                table.string('text').notNullable(),
                table.datetime('date')
            }).then(result => {
                console.log('Messages table created successfully.')
            }).finally(() => {
                knex.destroy() 
            })
        }
    })
    
module.exports = {
    knexSqlite
}