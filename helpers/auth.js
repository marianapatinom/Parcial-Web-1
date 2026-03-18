'use strict';

let jwt = require('jwt-simple');
let moment = require('moment');

let secret = 'parcial_web_secret_2024';

function createToken(usuario) {
    let payload = {
        sub: usuario._id,
        username: usuario.username,
        rol: usuario.rol,
        iat: moment().unix(),
        exp: moment().add(5, 'days').unix()
    };

    return jwt.encode(payload, secret);
}

function verificarToken(req, res, next) {
    try {
        let authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send({ message: 'No se envió el token de autenticación' });
        }

        let token = authHeader.replace('Bearer ', '').trim();
        let payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'El token ha expirado' });
        }

        req.userId = payload.sub;
        req.userRol = payload.rol;

        next();
    } catch (err) {
        res.status(401).send({ message: 'Token no válido' });
    }
}

module.exports = { createToken, verificarToken };
