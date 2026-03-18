'use strict';

let mongoose = require('mongoose');
let application = require('./application');

let PORT = 1702;
let MONGO_URI = 'mongodb://localhost:27017/parcial';

mongoose.connect(MONGO_URI).then(
    () => {
        console.log('Conexión a MongoDB exitosa');
        application.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    },
    (err) => {
        console.error('Error al conectar a MongoDB:', err);
    }
);