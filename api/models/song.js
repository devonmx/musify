'use strict'
// Conectar a la DB
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SongSchema = Schema({
	number: String,
	name: String,
	duration: String,
	file: String,
	album: {type: Schema.ObjectId, ref:'Album'}
});

module.exports = mongoose.model('Song', SongSchema);

// Guarda ID de un Documento de la DB de tipo Artist la forma de relacionar documentos
// album: {type: Schema.ObjectId, ref:'Album'}