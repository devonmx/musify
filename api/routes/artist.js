'user strict'

var express = require('express');
var ArtistController = require('../controllers/artist.js');
// Nos permite ahcer todas las opciones de Get POST PUT DELETE
var api = express.Router();
// Para restringir los accessos
var md_auth = require('../middlewares/authenticated');
// Subida de archivos.
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artists'});
// Formato URL,MIDDLEWARE,CONTROLADOR.METODOQUESEUSARA
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
// Page opcional :page?
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);
module.exports = api;
