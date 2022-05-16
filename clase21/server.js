const express = require('express')
const app = express()
const { faker } = require('@faker-js/faker');
PORT = 8080
app.listen(PORT,() => {console.log(`Server on en puerto ${PORT}`)})

faker.locale = 'es'

const nombres = ['Luis', 'Lucía', 'Juan', 'Augusto', 'Ana']
const apellidos = ['Pieres', 'Cacurri', 'Bezzola', 'Alberca', 'Mei']
const colores = ['rojo', 'verde', 'azul', 'amarillo', 'magenta']

app.get('/', (req, res) => {
  res.send('Estoy funcionando')
})

app.get('/test', (req, res) => {
  let max = 10
  let respuesta = []
  for (let i = 0; i < max; i++) {
    respuesta.push({
      nombre: nombres[Math.floor(Math.random() * nombres.length)],
      apellido: apellidos[Math.floor(Math.random() * apellidos.length)],
      color: colores[Math.floor(Math.random() * colores.length)]
    })
  }
  res.json(respuesta)
})

app.get('/faker', (req, res) => {
  let cant = parseInt(req.query.cant)
  let id = 1
  if (!cant) cant = 10
  let respuesta = []
  for (let i = 0; i < cant; i++) {
    respuesta.push({
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      color: faker.internet.color(),
      id: id++
    })
  }
  res.json(respuesta)
})