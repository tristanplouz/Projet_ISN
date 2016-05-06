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
var arduinoDisp=[{"ip":"0.0.0.0","name":"exemple"}];
var connected =[];//.id .name .duino
var PORT=5678;

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (client) {
    var indice;
	var code=client.id,pseudo;
	client.emit('welcome', "Quel est votre pseudo:");
	client.on("username",function(data){
		pseudo=data.name;
		connected.push({id :code,name:pseudo});
		client.emit("duino",arduinoDisp);
		client.on("duino",function(data){
			connected[connected.length-1].duino=data;
			console.log("Un client est connecté ! Il s'agit de " + connected[connected.length-1].id+ " appelé " +connected[connected.length-1].name+" sur la duino nommé "+arduinoDisp[connected[connected.length-1].duino].name);

		});

	});
    client.on("gyro",function(data){
		for(var i =0;i<connected.length;i++){
			if(connected[i].id==client.id){
				indice=i;
			}
		}
		console.log(pseudo+ ":"+data.beta+" at "+code);
		
		udp.send(decode(data),0,1,PORT,arduinoDisp[connected[i].duino].ip,function(err,bytes){
		    if (err){
			client.emit("err","Votre duino ne repond plus, essayer de trouver votre robot et de le redemarer");
		    };
		    });
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
udp.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
    if(message=="NEWCO"){
	    arduinoDisp.push({"ip":remote.address});
    }
    udp.send("HELLO", 0, 5, PORT, remote.address, function(err, bytes) {
	if (err) throw err;
	console.log('UDP message sent to ' + remote.address +':'+ PORT);
	udp.close();
    });
});
udp.bind(PORT);
server.listen(8080);

console.log("Server listen at "+server.address().port);
function decode(data){
    if(data.gamma>500){
	dir=1;
    }
    else{
	dir = 5;
    }
    return dir;//1 avance 2 recule 3 gauche 4 droite 5 stop
    }
