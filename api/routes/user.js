// Todas las rutas que definamos y los controladores que se definan en app.js
'use strict'
var express = require('express');
// Mandamos a llamar todas las funciones que se vayan a ejecutar
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Subida de archivos.
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

/* Si introduce esta url en el servidor manda a llamar los datos del controlador dependiendo la ruta
y la acccion que queramos */
api.get('/probando-controlador', md_auth.ensureAuth ,UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;  