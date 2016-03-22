	var ip = document.getElementById("ip");
	var url = document.location.href;

	var urlip = url.substring(8, url.indexOf("/"));

	ip.value = urlip;

	var socket;
	function connect(){
		socket = io.connect('http://'+ip.value+':8080');
	}

	socket.on("accueil", function(content){
		console.log(content.arduino);
	});

	socket.on("shutdown", function(){
		socket.close();
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