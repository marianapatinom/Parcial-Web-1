'use strict';

let express = require('express');
let router = express.Router();
let usuarioController = require('../controllers/usuarioController');

router.post('/api/usuario/registrar', usuarioController.registrar);
router.post('/api/usuario/login', usuarioController.login);

module.exports = router;
