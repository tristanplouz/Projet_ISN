var http = require('http');
var fs = require('fs');

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
	connected.push({"id":client.id,"name":undefined,"arduino":undefined});
	console.log("Un client est connecté ! Il s'agit de " + connected[connected.length-1].id + " appelé " +connected[connected.length-1].name);
	client.emit('welcome', { hello: 'world' });
    client.on("gyro",function(data){
			console.log(data.beta);
	});
    client.on("disconnect",function(e){
			console.log("deconnection");
	});
});

server.listen(8080);

console.log("Server listen at "+server.address().port);
