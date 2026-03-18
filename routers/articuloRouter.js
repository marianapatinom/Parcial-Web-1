'use strict';

let express = require('express');
let router = express.Router();
let articuloController = require('../controllers/articuloController');
let auth = require('../helpers/auth');

router.post('/api/articulo', auth.verificarToken, articuloController.crearArticulo);
router.get('/api/articulos', auth.verificarToken, articuloController.obtenerArticulos);

module.exports = router;
