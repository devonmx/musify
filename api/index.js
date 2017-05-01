'use strict'
// Conexion a base de datos
var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 8080;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, res) =>{
	if(err){
		throw err;
	}else{
		console.log("La base de datos esta corriendo a la perfeccion...");
		// Al iniciar configuramos un puerto para nuestro server
		app.listen(port, function(){
			console.log ("Servidor API REST en - http://localhost:"+port);
		});
	}
})