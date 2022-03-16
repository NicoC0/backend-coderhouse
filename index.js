import express from 'express'
import fs from 'fs'

let contadorPunto1 = 0
let contadorPunto2 = 0

const app = express()
const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Escuchando el puerto ${PORT}`)
    
})

class Archivo{
    constructor(name) {
        this.name = name;
    }
    leer = async(archivo) => {
        try {
            if (fs.existsSync(archivo)) {
                const data = await fs.promises.readFile(archivo, "utf-8");
                const products = JSON.parse(data)
                console.log(`Hay ${products.length} productos en la lista`)
                return products
            } else {
                console.log("La lista de productos está vacía: ",[])
            }
        } catch (error) {
            console.log("Ocurrió un error: ", error)
        }
    };
}

const archivo1 = new Archivo()

let productos = await archivo1.leer("productos.txt")
let productosJSON = JSON.stringify(productos)


app.get('/items', async (req, res) => {
    ++contadorPunto1
    const respuesta = {
        items: productosJSON,
        cantidad: productos.length,
    }
    res.json(respuesta)
})

app.get('/item-random', (req, res) => {
    ++contadorPunto2
    let numeroRandom = Math.floor(Math.random() * (productos.length))
    let productoRandom = JSON.stringify(productos[numeroRandom])
    res.json(productoRandom)
})

app.get('/visitas', (req, res) => {
    res.json({
        items: contadorPunto1,
        itemRandom: contadorPunto2,
    })
})