const express = require("express")
const router = express.Router()
const passport = require("passport")
const {
    Strategy: LocalStrategy
} = require("passport-local")
const bcrypt = require('bcrypt')

const rounds = 12

const hashPassword = (password, rounds) => {
    const hash = bcrypt.hashSync(password, rounds, (err, hash) => {
        if (err) {
            console.error(err)
            return err
        }
        return hash
    })
    return hash
}

const comparePassword = (password, hash) => {
    const bool = bcrypt.compareSync(password, hash, (err, res) => {
        if (err) {
            console.error(err)
            return false
        }
        return res
    })
    return bool
}

const userDAO = require('../../daos/RegisterUserDaoMongoDB')


passport.use(new LocalStrategy(async function (nombre, password, done) {
    let existeUsuario
    try {
        existeUsuario = await userDAO.getById(nombre)
    } catch (err) {
        throw done(err)
    }
    if (!existeUsuario) {
        console.log('Usuario no encontrado')
        return done(null, false);
    }
    const bool = await comparePassword(password, existeUsuario.password)
    if (bool == false) {
        console.log('Contraseña invalida')
        return done(null, false);
    }

    return done(null, existeUsuario);
}))

passport.serializeUser((usuario, done) => {
    done(null, usuario.nombre);
})

passport.deserializeUser( async (nombre, done) => {
    let usuario
    try {
        usuario = await userDAO.getById(nombre)
    } catch (err) {
        throw done(err)
    }
    done(null, usuario);
});

function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}
router.get('/', (req, res) => {
    if (req.session.nombre) {
        res.redirect('/home')
    } else {
        res.redirect('/login')
    }
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login-error'
}))

router.get('/login-error', (req, res) => {
    res.render('login-error');
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', async (req, res) => {
    const {
        nombre,
        password
    } = req.body;
    let newUsuario = null
    try {
        newUsuario = await userDAO.getById(nombre)
    } catch (err) {
        throw new Error(err)
    }
    if (newUsuario) {
        res.render('register-error')
    } else {
        const hash = hashPassword(password, rounds)
        const usuarioData = {
            nombre,
            password: hash
        }
        try {
        const graba = await userDAO.saveElement(usuarioData)
        } catch (err){
            throw  new Error(err)
        }
        res.redirect('/login')
    }
});

router.get('/home', isAuth, (req, res) => {
    res.render('home', {
        nombre: req.user.nombre
    });
});

router.get('/fired', (req, res) => {
    res.render('logout', {
        nombre: req.user.nombre
    });
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});


module.exports = router;