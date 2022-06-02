const knexMySQL = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'dbcoder'
    }
}

const knex = require('knex')(knexMySQL)
knex.schema.hasTable('products')
    .then(result => {
        if (!result) {
            knex.schema.createTable('products', table => {
                table.increments('id', {
                    primaryKey: true
                });
                table.string('title').notNullable();
                table.string('thumbnail').notNullable();
                table.float('price').notNullable();
            }).then(result => {
                console.log('Products table created successfully.')
            }).finally(() => {
                knex.destroy()
            })
        }
    })

module.exports = {
    knexMySQL
}