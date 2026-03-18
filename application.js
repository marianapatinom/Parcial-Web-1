'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let usuarioRouter = require('./routers/usuarioRouter');
let articuloRouter = require('./routers/articuloRouter');

let application = express();

application.use(bodyParser.json());

application.use(usuarioRouter);
application.use(articuloRouter);

module.exports = application;
