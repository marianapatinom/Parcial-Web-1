'use strict';

let Usuario = require('../models/usuarioModel');
let auth = require('../helpers/auth');
let bcrypt = require('bcryptjs');

function registrar(req, res) {
    let { username, password, rol } = req.body;

    if (!username || !password) {
        return res.status(400).send({ message: 'El username y el password son obligatorios' });
    }

    let nuevoUsuario = new Usuario({
        username: username,
        password: bcrypt.hashSync(password, 10),
        rol: rol || 'standard'
    });

    nuevoUsuario.save().then(
        (usuarioGuardado) => {
            res.status(201).send({
                message: 'Usuario registrado exitosamente',
                usuario: { username: usuarioGuardado.username, rol: usuarioGuardado.rol },
                token: auth.createToken(usuarioGuardado)
            });
        }
    ).catch(
        (err) => {
            if (err.code === 11000) {
                return res.status(400).send({ message: 'El username ya está en uso' });
            }
            res.status(500).send({ message: 'Error interno al registrar el usuario' });
        }
    );
}

function login(req, res) {
    let { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ message: 'Debe enviar username y password' });
    }

    Usuario.findOne({ username: username }).then(
        (usuario) => {
            if (!usuario) {
                return res.status(404).send({ message: 'Usuario no encontrado' });
            }

            if (!bcrypt.compareSync(password, usuario.password)) {
                return res.status(401).send({ message: 'Contraseña incorrecta' });
            }

            res.status(200).send({ token: auth.createToken(usuario) });
        }
    ).catch(
        () => {
            res.status(500).send({ message: 'Error interno al realizar el login' });
        }
    );
}

module.exports = { registrar, login };
