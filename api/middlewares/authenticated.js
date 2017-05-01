'use strict'
var jwt = require('jwt-simple');
// Guarda tiempo de creacion y expiracion
var moment = require('moment');
var secret = 'Clave ultra secreta bien vergas';

// El next es para salir del middleware por que es un proceso internmedio
exports.ensureAuth = function(req, res, next){
	if(!req.headers.authorization){
		return res.status(403).send({message: 'La petición no tiene la cabezera de autentication'})
	}

	var token = req.headers.authorization.replace(/['"]+/g, '');
	try{
		var payload = jwt.decode(token, secret);
		if(payload.exp <= moment().unix()){
			return res.status(401).send({message: 'El token ha expirado'});	
		}
	}catch(ex){
		return res.status(404).send({message: 'Token no valido'})
	}

	req.user = payload;

	next();
};
