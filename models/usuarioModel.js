'use strict';

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UsuarioSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['admin', 'standard'], default: 'standard' }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
