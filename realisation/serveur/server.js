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
var arduinoDisp=[{"ip":"127.0.0.1","name":"exemple"}];
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
		    if(data<arduinoDisp.length){
			if(!arduinoDisp[data].occup){
			    connected[connected.length-1].duino=data;
			    try {arduinoDisp[data].occup=1;}
			    catch(err){;}
			    console.log("Un client est connecté ! Il s'agit de " + connected[connected.length-1].id+ " appelé " +connected[connected.length-1].name+" sur la duino nommé "+arduinoDisp[connected[connected.length-1].duino].name);
			}else{
			    client.emit("err","Arduino deja prise, actualisé et prenez en une autre");
			    }
		    }else{
			client.emit("err","Arduino inexistante, actualisé et prenez en une autre");
		    }
		});

	});
    client.on("gyro",function(data){
		for(var i =0;i<connected.length;i++){
			if(connected[i].id==client.id){
				indice=i;
			}
		}
		//console.log(pseudo+ ":"+data.beta+" at "+code);
		if(connected[indice]!=undefined ){
		    if(arduinoDisp[connected[indice].duino]!=undefined){
			var toSend=decode(data);
			udp.send(toSend,0,toSend.length,PORT,arduinoDisp[connected[indice].duino].ip,function(err,bytes){
			    if (err){
				client.emit("err","Votre duino ne repond plus, essayer de trouver votre robot et de le redemarer");
			    }
			});
		    }
		}
	});
    client.on("fire",function(data){
	var toSend=new Buffer(String(10));
	udp.send(toSend,0,toSend.length,PORT,arduinoDisp[connected[indice].duino].ip,function(err,bytes){
			    if (err){
				client.emit("err","Votre duino ne repond plus, essayer de trouver votre robot et de le redemarer");
			    }
			});
		    });
    client.on("disconnect",function(e){
		for(var i =0;i<connected.length;i++){
			if(connected[i].id==client.id){
				console.log("deconnection de "+connected[i].name);
				
				try{ arduinoDisp[connected[i].duino].occup=0;}
				catch(err){
				    console.log(err);
				    }
				
				connected.splice(i,1);	
			}
		}
		
	});
});
udp.on('message', function (message, remote) {
    message=message.toString();
    console.log(remote.address + ':' + remote.port +' - ' + message);
    if(message.indexOf("hello")>-1){
	    arduinoDisp.push({"ip":remote.address,"name":message.substring(5,message.length),"occup":0});
	    console.log(arduinoDisp.toString().toString());
    }
    udp.send("HELLO", 0, 5, PORT, remote.address, function(err, bytes) {
	if (err) throw err;
	console.log('UDP message sent to ' + remote.address +':'+ PORT);
    });
});
udp.bind(PORT);
server.listen(8080);

console.log("Server socket.io listen at "+server.address().port);
console.log("Server UDP listen at "+ PORT);
function decode(data){
    if(data.beta<-25){
	dir=3;
    }
    else if(data.beta>25){
	dir=4;
    }
    else if(data.gamma>-30 && data.gamma<0){
	dir=1;
    }
    else if(data.gamma>-90 && data.gamma<-75){
	dir=2;
    }
    else{
	dir = 5;
    }
    return new Buffer(dir.toString());//1 avance 2 recule 3 gauche 4 droite 5 stop
    }
