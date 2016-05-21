//Declarations des librairies
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
//Initialisation du serveur
var server = http.createServer();

// Chargement de socket.io
var io = require('socket.io').listen(server);
//Declaration des variables
var arduinoDisp=[{"ip":"127.0.0.1","name":"exemple"}];
var connected =[];//.id .name .duino
var PORT=5678;//Port UDP

// Definition des constantes
const var droite = 4,gauche= 3,avance=1,recule=2,stop=5; 

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (client) {
    //Variable du client
    var indice;
    var code=client.id,pseudo;
    //Partie connection
    client.emit("available",arduinoDisp);
    client.on("login",function(data){ //data={"name":"","arduino":nbr}
	pseudo=data.name;
	connected.push({"id" :code,"name":pseudo});
	if(data.arduino<arduinoDisp.length){
	    if(!arduinoDisp[data.arduino].occup){
		connected[connected.length-1].duino=data.arduino;
		arduinoDisp[connected[connected.length-1].duino].occup=1;
		console.log("Un client est connecté ! Il s'agit de " + connected[connected.length-1].id+ " appelé " +connected[connected.length-1].name+" sur la duino nommé "+arduinoDisp[connected[connected.length-1].duino].name);
		client.emit("start");
	    }
	    else{ //Erreur si quelqu'un est deja dessus
		client.emit("err","Arduino deja prise, actualisez et prenez en une autre");
		console.log(data.arduino +"est deja prise, ECHEC");
	    }
	}
	else{ //Erreur si elle n'existe pas
	    client.emit("err","Arduino inexistante, actualisez et prenez en une autre");
	    console.log(data.arduino +"est inexistante, ECHEC");
	}
    });
    client.on("gyro",function(data){ //Partie gyroscope
	for(var i =0;i<connected.length;i++){
		if(connected[i].id==client.id){
			indice=i;
		}
	}
	console.log(pseudo+ ":"+data.beta+" at "+code);
	if(connected[indice]!=undefined ){
	    if(arduinoDisp[connected[indice].duino]!=undefined){
		//envoi d'une tram UDP
		var toSend=decode(data);
		udp.send(toSend,0,toSend.length,PORT,arduinoDisp[connected[indice].duino].ip,function(err,bytes){
		    if (err){
			client.emit("err","Votre Arduino ne repond plus, essayez de trouver votre robot et de le redemarer");
		    }
		});
	    }
	}
    });
    client.on("fire",function(data){
	var toSend=new Buffer(String(10));
	udp.send(toSend,0,toSend.length,PORT,arduinoDisp[connected[indice].duino].ip,function(err,bytes){
	    if (err){
		client.emit("err","Votre arduino ne repond plus, essayez de trouver votre robot et de le redemarer");
	    }
	});
    });
    client.on("disconnect",function(e){ //Partie deconnection
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

udp.bind(PORT); //Mise en place du serveur UDP sur le port 5678
server.listen(8080); //Ecoute du serveur sur le port 8080 

console.log("Server socket.io listen at "+server.address().port);
console.log("Server UDP listen at "+ PORT);




function decode(data){//Decode les informations du gyroscope
/****************************
 *     1   *    Avancer     *
 ****************************
 *     2   *    Recule      *
 ****************************
 *     3   *    Gauche      * 
 * **************************
 *     4   *    Droite      *
 * **************************
 *     5   *    Stop        *
 * **************************
 */
    if(data.beta<-25){
	dir=gauche;
    }
    else if(data.beta>25){
	dir=droite;
    }
    else if(data.gamma>-30 && data.gamma<0){
	dir=avance;
    }
    else if(data.gamma>-90 && data.gamma<-75){
	dir=recule;
    }
    else{
	dir = stop;
    }
    return new Buffer(dir.toString());//Buffer pour l'UDP
}
