		
	document.getElementById("ip").value = document.location.href; 


	var socket;
	function connect(){
		var ip = document.getElementById("ip");
		socket = io.connect('http://'+ip.value+':8080');
	}

	socket.on("accueil", function(content){
		console.log(content.arduino);
	});

	gyro.frequency = 500;
	gyro.startTracking(function(g){
		var f = document.getElementById("gyro");
		var v = document.getElementById("visu");
		f.innerHTML =
        	"<p>alpha : "+g.alpha+"</p>"+
        	"<p>beta : "+g.beta+"</p>"+
        	"<p>gamma : "+g.gamma+"</p>";

		v.style.transform = "rotate("+g.beta+"deg)";
		console.log(socket);
		
		if(!(socket === undefined)){
			console.log("send");
			socket.emit("gyro", {alpha:g.alpha, beta:g.beta, gamma:g.gamma})
		}
		else{
			console.log("notsend");
			}
	});