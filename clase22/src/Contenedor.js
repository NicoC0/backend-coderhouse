const { faker } = require("@faker-js/faker");
faker.setLocale('es')

module.exports = class Contenedor {
    constructor(database, table) {
        this.database = database
        this.table = table
    }

    async getAll() {
        try {
            const lista = []
            for (let i = 0; i < 5; i++) {
                lista.push({
                    name: faker.commerce.product(),
                    price: faker.commerce.price(100),
                    image: faker.image.imageUrl()
                })
            }
            return {
                status: 'success',
                payload: lista,
            }
        } catch (err) {
            return {
                status: "Error read database.",
                message: err.message,
            }
        }
    }

}