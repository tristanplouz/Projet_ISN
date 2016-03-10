var http = require('http');
var fs = require('fs');
var io = require('socket.io').listen(server);

var server = http.createServer(function(req, res) {
//	res.writeHead(200, {'Content-Type':'text/plain'});
        fs.readFile( '../client/index.html', function(err, data){ 

      if ( err ){ 
	res.writeHead(404, {'Content-Type': 'text/plain'}); 
	res.end('Erreur 404: Fichier non trouvé\n'); 
      } else { 
	  res.writeHead(200, {'Content-Type': 'text/html' }); 
	  // retourne le fichier trouvé 
	  res.end( data ); 
      } 
    }); 
}).listen(8080);

io.sockets.on('connection', function(socket){
  console.log('a user connected');
});


console.log("listening on 8080 at localhost");
