'use strict';

let Articulo = require('../models/articuloModel');

function crearArticulo(req, res) {
    if (req.userRol !== 'admin') {
        return res.status(403).send({ message: 'No está autorizado para crear artículos. Se requiere rol de administrador' });
    }

    let { titulo, descripcion, precio } = req.body;

    if (!titulo || !descripcion || !precio) {
        return res.status(400).send({ message: 'El titulo, descripcion y precio son obligatorios' });
    }

    if (precio <= 0) {
        return res.status(400).send({ message: 'El precio debe ser mayor a 0' });
    }

    let nuevoArticulo = new Articulo({
        titulo: titulo,
        descripcion: descripcion,
        precio: precio
    });

    nuevoArticulo.save().then(
        (articuloGuardado) => {
            res.status(201).send({
                message: 'Artículo creado exitosamente',
                articulo: articuloGuardado
            });
        }
    ).catch(
        () => {
            res.status(500).send({ message: 'Error interno al crear el artículo' });
        }
    );
}

function obtenerArticulos(req, res) {
    Articulo.find().then(
        (articulos) => {
            res.status(200).send({ articulos: articulos });
        }
    ).catch(
        () => {
            res.status(500).send({ message: 'Error interno al obtener los artículos' });
        }
    );
}

module.exports = { crearArticulo, obtenerArticulos };
