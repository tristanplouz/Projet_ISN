var http = require('http');
var fs = require('fs');
var dgram = require('dgram');
var udp = dgram.createSocket('udp4');

// UNCOMMENT IF NO APACHE SERVER Chargement du fichier index.html affiché au client
/*var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});*/
var server = http.createServer();

// Chargement de socket.io
var io = require('socket.io').listen(server);
var arduinoDisp={arduino:["une","deux"]};
var connected =[];
// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (client) {
	console.log(JSON.stringify(connected.toString()));
	var code=client.id,pseudo;
	client.emit('welcome', "Quel est votre pseudo:");
	client.on("username",function(data){
		pseudo=data.name;
		connected.push({id :code,name:pseudo});
		console.log("Un client est connecté ! Il s'agit de " + connected[connected.length-1].id+ " appelé " +connected[connected.length-1].name);
	});
    client.on("gyro",function(data){
		console.log(pseudo+ ":"+data.beta+" at "+code);
	});
    client.on("disconnect",function(e){
		for(var i =0;i<connected.length;i++){
			if(connected[i].id==client.id){
				console.log("deconnection de "+connected[i].name);
				connected.splice(i,1);	
			}
		}
		
	});
});

server.listen(8080);

console.log("Server listen at "+server.address().port);
