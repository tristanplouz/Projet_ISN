var socket = io.connect(document.location.href.slice(0,20) + ":8080");
var ready=false;
alert(document.location.href.slice(0,20) + ":8080");
socket.on("welcome",function(data){
		socket.emit("username",{name:prompt(JSON.stringify(data))});
		ready=true;
});

socket.on("duino",function(data){
		var duino = prompt(data);
		ready=true;
		socket.emit("duino",String(duino));
		ready=true;
});
socket.on("err",function(data){
		alert(data);
});
gyro.frequency = 100;
gyro.startTracking(function(g){
	var f = document.getElementById("gyro");
	var v = document.getElementById("visu");
	f.innerHTML =
		"<p>alpha : "+g.alpha+"</p>"+
		"<p>beta : "+g.beta+"</p>"+
		"<p>gamma : "+g.gamma+"</p>"
		;
	v.style.transform = "rotate("+g.beta+"deg)";
	if(ready)
		socket.emit("gyro", {alpha:g.alpha, beta:g.beta, gamma:g.gamma})
	});
