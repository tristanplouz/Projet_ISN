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
// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !'+socket.id);
    io.emit("accueil",arduinoDisp);
    socket.on("gyro",function(data){
			console.log(data.beta);
	});
    socket.on("disconnect",function(e){
			console.log("deconnection");
	});
});
process.on("exit", function() {
  server.io.sockets.emit("shutdown");
});
server.listen(8080);

console.log("Server listen at "+server.address().port);
