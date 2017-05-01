/*
Todo lo que se usara al momento de que se ejecute en routes/user.js
*/
'use strict'
// Sistema de ficheros
var fs = require('fs');
// Acceder a las rutas
var path = require('path');
// Encriptar password
var bcrypt = require('bcrypt-nodejs');
// Si se requieren mandar a llamar los modelos para las consultas
var User = require('../models/user');
// Cargar fichero del token
var jwt = require('../services/jwt');
function pruebas(req, res){
	res.status(200).send({
		message: 'Probando acción de usuarios del API REST MongoDB'
	});
}

function saveUser(req, res){
	// Para guardar en la base de datos se manda a llamar la clase User que proviene de models/user
	var user = new User();
	// Todos los parametros que se leen de los formularios
	var params = req.body;
	console.log(params);
	// Definimos las variables que contendran los datos
	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';
	if(params.password){
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;
			if(user.name != null && user.surname != null && user.email != null){
				// Guarda el usuario
				user.save((err, userStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar usuario'});
					}else{
						if(!userStored){
							res.status(404).send({message: 'No se registro el usuario'});
						}else{
							res.status(200).send({user: userStored})
						}
					}
				});
			}else{
				res.status(200).send({message: 'Rellena todos los campos'});		
			}
		});

	}else{
		res.status(200).send({message: 'Introduce la contraseña'});
	}

}

function loginUser(req, res){
	var params = req.body;
	var email = params.email;
	var password = params.password;

	// Puede servir para usuarios duplicados
	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe'});
			}else{
				// Comprobar contraseña
				bcrypt.compare(password, user.password, function(err, check){
					if(check){
						// Devolver datos usuario logueado
						if(params.gethash){
							res.status(200).send({
								token: jwt.createToken(user)
							})
						}else{
							res.status(200).send({user});	
						}
					}else{
						res.status(404).send({message: 'El usuario no ha podido logearse'});
					}
				});
			}
		}
	});
}


function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;
	console.log(userId);

	if(userId != req.user.sub){
		return res.status(500).send({message:'No tienes permiso para actualizar este usuario.'});
	}

	User.findByIdAndUpdate(userId, update, (err, userUpdate) =>{
		if(err){
			res.status(500).send({message: 'Error al actualizar el usuario'});
		}else{
			if(!userUpdate){
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdate});
			}
		}
	});
}

function uploadImage(req,res){
	var userId = req.params.id;
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
			User.findByIdAndUpdate(userId,{image: file_name}, (err, userUpdate) => {
				if(!userUpdate){
					res.status(404).send({message: 'No se ha podido actualizar la imagen...'});
				}else{
					res.status(200).send({image: file_name, user: userUpdate});
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
	var path_file = './uploads/users/'+imageFile;
	fs.exists (path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file))
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
}; 