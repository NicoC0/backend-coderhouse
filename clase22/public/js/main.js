const socket = io.connect();
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;

// Autor
const schemaAuthor = new schema.Entity('author', {}, {
    idAttribute: 'mail'
})
// Mensaje
const schemaMensaje = new schema.Entity('mensaje', {
    author: schemaAuthor
}, {
    idAttribute: 'id'
})
// Mensajes
const schemaMensajes = new schema.Entity('mensajes', {
    mensajes: [schemaMensaje]
}, {
    idAttribute: 'id'
})

function testmail(mail) {
    try {
        var exp = /^[a-z0-9_.]+@[a-z0-9]+\.[a-z0-9_.]+$/i
        return exp.test(mail)
    } catch (error) {
        return false;
    }
}
function SendMesage() {

    if (document.getElementById('mail').value == "" ||
        document.getElementById('nombre').value == "" ||
        document.getElementById('apellido').value == "" ||
        document.getElementById('edad').value == "" ||
        document.getElementById('alias').value == "" ||
        document.getElementById('avatar').value == "" ||
        document.getElementById('mensaje').value == "") {
        alert("Campos Incompletos")
        return false
    }
    const date = new Date()
    const mensaje = {
        author: {
            mail: document.getElementById('mail').value,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: document.getElementById('mensaje').value,
        date: date.toLocaleString(),
    }
    socket.emit('newMessage', mensaje);
    document.getElementById('mensaje').value = "";
    return false;
}

const tableMessages = async messages => {
    const template = await fetch('../viewsHBS/messages.hbs');
    const templateText = await template.text();
    const templateHbs = Handlebars.compile(templateText);
    const html = templateHbs({
        messages
    });
    return html
};

socket.on('messages', messages => {
    const denormalizedData = denormalize(messages.result, schemaMensajes, messages.entities)
    const newMessages = denormalizedData.mensajes

    const sizeNormalized = JSON.stringify(messages).length
    const sizeDenormalizr = JSON.stringify(denormalizedData).length

    const compresion = parseInt((sizeNormalized*100)/sizeDenormalizr)

    console.log('compresion' , compresion)
    document.getElementById('compresion-info').innerText = compresion;

    tableMessages(newMessages)
        .then(html => document.getElementById('tableMessages').innerHTML = html);
});
const tableHandlebars = async products => {
    const template = await fetch('../viewsHBS/products.hbs');
    const templateText = await template.text();
    const templateHbs = Handlebars.compile(templateText);
    const html = templateHbs({
        products
    });
    return html
};

socket.on('products', products => {
    tableHandlebars(products)
        .then(html => document.getElementById('tableProducts').innerHTML = html);
});