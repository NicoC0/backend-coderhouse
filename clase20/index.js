const express = require('express')
const app = express()
const PORT = 8080

app.get('/', (req, res, next) => {

})

app.listen(PORT, () => {
  console.log(`Puerto escuchando al puerto ${PORT}`)
})