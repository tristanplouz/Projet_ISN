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

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !'+socket.toString());
    socket.emit("msg","cc",function(){
		console.log("send to "+socket);
		});
    socket.on("gyro",function(data){
			console.log(data.beta);
	});
});


server.listen(8080);

console.log("Server listen at "+server.address().port);
