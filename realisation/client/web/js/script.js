var socket = io.connect(document.location.href.slice(0,20) + ":8080");

var divArdu1="<a class='arduino' onclick=choix('";
var divArdu2="')> <span>ROBOT</span> <span class='num'>";
var divArdu3="</span> </a>";

var d = document.getElementById('dispo');
var r = document.getElementById('robot');
var p = document.getElementById('username');
var g = document.getElementById('gyro');
var v = document.getElementById("visu");


socket.on("available",function(data){
	for(var i = 0; i < data.length; i++){
		if(!data[i].occup){
			r.innerHTML += divArdu1+i+divArdu2+data[i].name+divArdu3;
		}
	}
});

socket.on("err",function(data){
	alert(data);
});


gyro.frequency = 100;

socket.on("start",function(){
	while(true){
		gyro.startTracking(function(g){
		f.innerHTML =
			"<p>alpha : "+g.alpha+"</p>"+
			"<p>beta : "+g.beta+"</p>"+
			"<p>gamma : "+g.gamma+"</p>";
		v.style.transform = "rotate("+g.beta+"deg)";
		socket.emit("gyro", {alpha:g.alpha, beta:g.beta, gamma:g.gamma})
		});
	}
});


function choix (name) {
	if(p.value != ""){
		socket.emit("login",{name:value, duino:name});
		d.style.display = "none";
		g.style.display = "block";
	}
}