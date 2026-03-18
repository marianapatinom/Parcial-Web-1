'use strict';

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ArticuloSchema = new Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true }
});

module.exports = mongoose.model('Articulo', ArticuloSchema);
