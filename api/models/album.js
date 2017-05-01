'use strict'
// Conectar a la DB
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
	title: String,
	description: String,
	year: Number,
	image: String,
	artist: {type: Schema.ObjectId, ref:'Artist'}
}); 

module.exports = mongoose.model('Album', AlbumSchema);

// Guarda ID de un Documento de la DB de tipo Artist la forma de relacionar documentos
// artist: {type: Schema.ObjetId, ref:'Artist'}