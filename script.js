//var socket = io.connect(document.location.href.slice(0,15) + ":8080");
alert(document.location.href.slice(0,15) + ":8080");

gyro.frequency = 5;
gyro.startTracking(function(g){
	var f = document.getElementById("gyro");
	var v = document.getElementById("visu")
	f.innerHTML =
		"<p>alpha : "+g.alpha+"</p>"+
		"<p>beta : "+g.beta+"</p>"+
		"<p>gamma : "+g.gamma+"</p>"
		;
	v.style.transform = "rotate("+g.beta+"deg)";
	socket.emit("gyro", {alpha:g.alpha, beta:g.beta, gamma:g.gamma})
});