const { faker } = require('@faker-js/faker');
faker.locale = 'es'

class User {
  static users = []

  async populate(cant = 50) {
    try {
      let id = 1
      for (let i = 0; i < cant; i++) {
        User.users.push({
          id: id++,
          nombre: faker.name.findName(),
          email: faker.internet.email(),
          website: faker.internet.domainName(),
          image: faker.internet.avatar()
        })
      }
      return User.users
    } catch (error) {
      console.log(error)
    }
  }

  async get(id = null) {
    try {
      return id ? User.users.filter(obj => obj.id == id) : User.users
    } catch (error) {
      console.log(error)
    }
  }

  async create(obj) {
    try {
      User.users.push({id: User.users.length + 1, ...obj})
      return User.users
    } catch (error) {
      console.log(error)
    }
  }

  async update(id, obj) {
    try {
      User.users = User.users.map(user => {
        if (user.id == id) {
          user = {id, ...obj}
        }
        return User.users
      })
    } catch (error) {
      console.log(error)
    }
  }

  async delete(id) {
    try {
      User.users = User.users.filter(obj => obj.id != id)
      return User.users
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new User()