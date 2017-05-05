'use strict'
// Sistema de ficheros
var path = require("path");
var fs = require("fs");
var mongoosePaginate = require("mongoose-pagination")
// Cargamos los modelos
var Artist = require("../models/artist");
var Album = require("../models/album");
var Song = require("../models/song");

function getArtist(req, res){
	var artistId = req.params.id;

	Artist.findById(artistId, (err, artist) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición de artista'});
		}else{
			if(!artist){
				res.status(404).send({message: 'El artista no existe'});
			}else{
				res.status(200).send({artist: artist});
			}
		}
	});
}

function saveArtist(req,res){
	var artist = new Artist();

	var params = req.body;
	artist.name = params.name;
	artist.description=params.description;
	artist.image = 'null';
	artist.save((err,artistStored) =>{
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistStored){
				res.status(404).send({message: 'El artista no ha sido guardado'});
			}else{
				res.status(200).send({artist: artistStored});
			}
		}
	})
}

function updateArtist(req, res){
	var artistId = req.params.id;
	var update = req.body;
	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdate) => {
		if(err){
			res.status(500).send({message: 'Error al actualizar el artista.'});
		}else{
			if(!artistUpdate){
				res.status(404).send({message: 'El artista no ha sido actualizado.'});
			}else{
				res.status(200).send({artist: artistUpdate});
			}
		}
	});
}

function getArtists(req, res){
	// Paginacion
	if(req.params.page){
		var page = req.params.page;	
	}else{
		var page = 1;
	}
	var itemsPerPage = 4;

	Artist.find().sort('name').paginate(page,itemsPerPage, (err, artists, total) => {
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!artists){
				res.status(404).send({message: 'No hay artistas.'});
			}else{
				return res.status(200).send({
					total_items: total,
					artists: artists
				});
			}
		}
	});
}

function deleteArtist(req, res){
	var artistId = req.params.id;
	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if(err){
			res.status(500).send({message: 'Error al eliminar el artista.'});
		}else{
			if(!artistRemoved){
				res.status(404).send({message: 'El artista no ha sido eliminado.'});
			}else{

				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
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
										res.status(200).send({artist: artistRemoved});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}


function uploadImage(req,res){
	var artistId = req.params.id;
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
			Artist.findByIdAndUpdate(artistId,{image: file_name}, (err, artistUpdate) => {
				if(!artistUpdate){
					res.status(404).send({message: 'No se ha podido actualizar la imagen...'});
				}else{
					res.status(200).send({user: artistUpdate});
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
	var path_file = './uploads/artists/'+imageFile;
	fs.exists (path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file))
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
}