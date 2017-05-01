'use strict'
// Sistema de ficheros
var path = require("path");
var fs = require("fs");
var mongoosePaginate = require("mongoose-pagination")
// Cargamos los modelos
var Artist = require("../models/artist");
var Album = require("../models/album");
var Song = require("../models/song");


function getAlbum(req,res){
	var albumId = req.params.id;
	Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!album){
				res.status(404).send({message: 'No existe el album.'});
			}else{
				res.status(200).send({album});
			}
		}
	});
}

function getAlbums(req, res){
	var artistId = req.params.artist;
	if(!artistId){
		//Sacar todos los albums de la base de datos
		var find = Album.find({}).sort('title');
	}else{
		//Sacar los albums de un artista concreto de la DB
		var find = Album.find({artist: artistId}).sort('year')
	}

	// Le indicamos el id del objeto al cual esta asociado en el Models
	find.populate({path: 'artist'}).exec((err,albums) => {
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!albums){
				res.status(404).send({message: 'No hay albums'});
			}else{
				res.status(200).send({albums});
			}
		}
	});
}

function saveAlbum(req,res){
	var album = new Album();

	var params = req.body;
	album.title = params.title;
	album.description= params.description;
	album.year = params.year;
	album.artist = params.artist;
	album.image = 'null';

	album.save((err,albumStored) =>{
		if(err){
			res.status(500).send({message: 'Error en el servidor.'});
		}else{
			if(!albumStored){
				res.status(404).send({message: 'El album no se ha guardado.'});
			}else{
				res.status(200).send({message: albumStored});
			}
		}
	})
}

function updateAlbum(req, res){
	var albumId = req.params.id;
	var update = req.body;
	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor.'});
		}else{
			if(!albumUpdated){
				res.status(404).send({message: 'No se ha actualizado el album.'});
			}else{
				res.status(200).send({album: albumUpdated});
			}
		}
	});
}

function deleteAlbum(req, res){
	var albumId = req.params.id;
	Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
		if(err){
			res.status(500).send({message: 'Error al eliminar el album.'});
		}else{
			if(!albumRemoved){
				res.status(404).send({message: 'El artista no ha sido eliminado.'});
			}else{
				Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
					if(err){
						res.status(500).send({message: 'Error al eliminar el la canción.'});
					}else{
						if(!songRemoved){
							res.status(404).send({message: 'La canción no ha sido eliminada.'});
						}else{
							res.status(200).send({album: albumRemoved});
						}
					}
				});
			}
		}
	});
}

function uploadImage(req,res){
	var albumId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		// Te devuelte la ruta completa y la imagen
		var file_path = req.files.image.path;
		// Separamos el nombre de las rutas / /
		var file_split =  file_path.split('\/');
		// como la ruta es /uploads/users/imagen.jpg por eso tomamos el [2] 
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' ){
			Album.findByIdAndUpdate(albumId,{image: file_name}, (err, albumUpdate) => {
				if(!albumUpdate){
					res.status(404).send({message: 'No se ha podido actualizar la imagen...'});
				}else{
					res.status(200).send({album: albumUpdate});
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

// Devuelve la imagen
function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/albums/'+imageFile;
	fs.exists (path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file))
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}


module.exports = {
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
}