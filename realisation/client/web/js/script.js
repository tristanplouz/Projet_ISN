var socket = io.connect(document.location.href.slice(0,20) + ":8080");

var divArdu1="<a class='arduino' onclick=choix('";
var divArdu2="')> <span>ROBOT</span> <span class='num'>";
var divArdu3="</span> </a>";

var d = document.getElementById('dispo');
var r = document.getElementById('robot');
var p = document.getElementById('username');
var g = document.getElementById('gyro');
var v = document.getElementById("visu");

var connect=0;
checkBrowser();
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
	connect=1;
});

gyro.startTracking(function(g){
	g.innerHTML =
		"<p>alpha : "+g.alpha+"</p>"+
		"<p>beta : "+g.beta+"</p>"+
		"<p>gamma : "+g.gamma+"</p>";
	v.style.transform = "rotate("+g.beta+"deg)";
	if(g.gamma>-30 && g.gamma<0){
        	v.style.transform = "translate(50%)";
    	}
    	if(g.gamma>-90 && g.gamma<-75){
        	v.style.transform = "translate(-50%)";
    	}
	if(g.alpha==undefined &&g.beta == undefined && g.gamma==undefined){
		//alert("Aucun gyroscope détecté\nEssayer Chrome sur mobile (très recommandé)");
		console.log("rien");
		console.log(g.alpha);	
}
	if(connect){
		socket.emit("gyro", {"alpha":g.alpha, "beta":g.beta, "gamma":g.gamma});
	}
});


function choix (name) {
	if(p.value != ""){
		socket.emit("login",{name:p.value, arduino:name});
		d.style.display = "none";
		g.style.display = "block";
	}
}

function checkBrowser(){
	var browser = navigator.userAgent;
	if(browser.indexOf("Chrome")==-1 ){
		alert("Utiliser Chrome s'il vous plait");
	}
	if(browser.indexOf("Android")==-1){
		alert("Votre appareil ne semble pas etre un mobile compatible")
	}
}
