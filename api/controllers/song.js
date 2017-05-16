'use strict'
// Sistema de ficheros
var path = require("path");
var fs = require("fs");
var mongoosePaginate = require("mongoose-pagination")
// Cargamos los modelos
var Artist = require("../models/artist");
var Album = require("../models/album");
var Song = require("../models/song");


function getSong(req, res){
	var songId = req.params.id;
	Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!song){
				res.status(404).send({message: 'No existe la canción.'});
			}else{
				res.status(200).send({song: song});
			}
		}
	});
}

function getSongs(req, res){
	var albumId = req.params.album;
	if(!albumId){
		//Sacar todos los albums de la base de datos
		var find = Song.find({}).sort('number');
	}else{
		//Sacar los albums de un artista concreto de la DB
		var find = Song.find({album: albumId}).sort('number')
	}

	// Le indicamos el id del objeto al cual esta asociado en el Models
	find.populate({
		path: 'album',
		populate:{
			path: 'artist',
			model: 'Artist'
		}
	}).exec((err,songs) => {
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!songs){
				res.status(404).send({message: 'No hay canciones'});
			}else{
				res.status(200).send({songs: songs});
			}
		}
	});
}

function saveSong(req,res){
	var song = new Song();

	var params = req.body;
	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.album = params.album;
	song.file = null;

	console.log(song);

	song.save((err,songStored) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor.'});
		}else{
			if(!songStored){
				res.status(404).send({message: 'La canción no se ha guardado.'});
			}else{
				res.status(200).send({song: songStored});
			}
		}
	})
}

function updateSong(req, res){
	var songId = req.params.id;
	var update = req.body;
	Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor.'});
		}else{
			if(!songUpdated){
				res.status(404).send({message: 'No se ha actualizado la canción.'});
			}else{
				res.status(200).send({song: songUpdated});
			}
		}
	});
}

function deleteSong(req, res){
	var songId = req.params.id;
	Song.findByIdAndRemove(songId, (err, songRemoved) => {
		if(err){
			res.status(500).send({message: 'En el servidor.'});
		}else{
			if(!songRemoved){
				res.status(404).send({message: 'La canción no ha sido eliminada.'});
			}else{
				res.status(200).send({song: songRemoved});
			}
		}
	});
}

function uploadFile(req,res){
	var songId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		// Te devuelte la ruta completa y la imagen
		var file_path = req.files.file.path;
		// Separamos el nombre de las rutas / /
		var file_split =  file_path.split('\/');
		// como la ruta es /uploads/users/imagen.jpg por eso tomamos el [2] 
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'mp3' || file_ext == 'ogg'){
			Song.findByIdAndUpdate(songId,{file: file_name}, (err, songUpdate) => {
				if(!songUpdate){
					res.status(404).send({message: 'No se ha podido actualizar la canción...'});
				}else{
					res.status(200).send({song: songUpdate});
				}
			});
		}else{
			res.status(200).send({message: 'Extensión del archivo no valida'});
		}

		console.log(file_path);
	}else{
		res.status(200).send({message: 'No se has subido ninguna imagen...'});
	}
}

// Devuelve la cancuón
function getSongFile(req, res){
	var songFile = req.params.songFile;
	var path_file = './uploads/songs/'+songFile;
	fs.exists (path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file))
		}else{
			res.status(200).send({message: 'No existe la canción...'});
		}
	});
}


module.exports = {
	getSong,
	saveSong,
	getSongs,
	updateSong,
	deleteSong,
	uploadFile,
	getSongFile
}