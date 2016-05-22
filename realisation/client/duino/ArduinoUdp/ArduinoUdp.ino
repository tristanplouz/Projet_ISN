#include <SPI.h>
#include <WiFi.h>
#include <WiFiUdp.h>

int status = WL_IDLE_STATUS;
//Information du reseau wifi
char ssid[] = "tristan-PC"; 
char pass[] = "wRq8FTlt";
String ipBroadcast="10.42.0.255";
unsigned int localPort = 5678; //Port UDP

char packetBuffer[255];
char HelloBuffer[] = "helloa02"; //packet d'initialisation "hello+nom"

WiFiUDP Udp;

int dirA = 2; // sens Moteur A 
int dirB = 4; // sens Moteur B
int pwmA = 3; //vitesse Moteur A
int pwmB = 5; //vitesse Moteur B

int laserOn=0;
long lsttime,timeout=2000;

void setup() {
  initH();

  Serial.begin(9600);
  while (!Serial) {
    ;
  }

  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("Pas de Shiel WIFI");
    while (true);
  }

  String fv = WiFi.firmwareVersion();
  if (fv != "1.1.0") {
    Serial.println("Mise a jour du firmware necessaire");
  }

  while (status != WL_CONNECTED) {
    Serial.print("Tentative de connexion au reseau wifi : ");
    Serial.println(ssid);
    status = WiFi.begin(ssid,pass);
    delay(5000);
  }
  Serial.println("Connecte au réseau wifi");
  printWifiStatus();

  Serial.println("\nTentative d'ouverture du socket...");
  while (!Udp.begin(localPort)) {
    Serial.println("Echec");
    delay(2000);
  }
  Serial.println("Socket ouverte, la communication peut commencer");

  Serial.println("\nEnvoi du packet hello");
  Serial.println(Udp.remoteIP());
  Udp.beginPacket(ipBroadcast, localPort);
  Udp.write(HelloBuffer);
  if (Udp.endPacket()) {
    Serial.println("Packet envoye");
  }
}

void loop() {

  int packetSize = Udp.parsePacket();
  if (packetSize) {
    //Serial.print("\nPacket UDP recu, Taille : ");
    //Serial.println(packetSize);
    //Serial.print("Emetteur : ");
    IPAddress remoteIp = Udp.remoteIP();
    //Serial.print(remoteIp);
    //Serial.print(", Port : ");
    //Serial.println(Udp.remotePort());

    int len = Udp.read(packetBuffer, 255); //Reception des Données
    if (len > 0) {
      packetBuffer[len] = 0;
    }
    //Serial.println("Contenu : ");
    //Serial.println(String(packetBuffer));

    if (String(packetBuffer) == "1") { //1:avance 
      forward(255);
    }
    if (String(packetBuffer) == "2") {//2:recule
      back(255);
    }
    if (String(packetBuffer) == "4") {//4:droite
      right(200);
    }
    if (String(packetBuffer) == "3") {//3:gauche
      left(2010);
    }
    if (String(packetBuffer) == "5") {//5:Stop
      halt();
    }
     if (String(packetBuffer) == "10") {//10:laser
      laserOn=1;
      Serial.println("FEU");
      lsttime=millis();
    }
    laser();
  }
  delay(10); //Pour la stabilité
}
/********************************************
 Fonction d'initialisation
 * printWifiStatus() pour log les infos wifi
 * initH() pour initialiser les pins
 ********************************************/

void printWifiStatus() {
  Serial.print("SSID : "); //Log dans la console
  Serial.println(WiFi.SSID());

  IPAddress ip = WiFi.localIP();
  Serial.print("Adresse IP : ");
  Serial.println(ip);

  long rssi = WiFi.RSSI();
  Serial.print("Intensite du signal : ");
  Serial.print(rssi);
  Serial.println(" dBm");
}

void initH() {
  pinMode(dirA, OUTPUT);
  pinMode(dirB, OUTPUT);
  pinMode(pwmA, OUTPUT);
  pinMode(pwmB, OUTPUT);
}

/***************************************
Fonction du robot:
 * forward(vitesse) pour avancer
 * right(vitesse) pour tourner à droite
 * left(vitesse) pour tourner à gauche
 * back(vitesse) pour reculer
 * halt() pour s'arreter
 * laser() pour tirer
 **************************************/
 
void forward(int vit) {
  //Serial.println("Avance !");
  digitalWrite(dirA, LOW);
  digitalWrite(dirB, LOW);
  analogWrite(pwmA, vit);
  analogWrite(pwmB, vit);
}

void right(int vit) {
  //Serial.println("Droite !");
  digitalWrite(dirA, HIGH);
  digitalWrite(dirB, LOW);
  analogWrite(pwmA, vit);
  analogWrite(pwmB, vit);
}

void left(int vit) {
  //Serial.println("Gauche !");
  digitalWrite(dirA, LOW);
  digitalWrite(dirB, HIGH);
  analogWrite(pwmA, vit);
  analogWrite(pwmB, vit);
}

void back(int vit) {
  //Serial.println("Recule !");
  digitalWrite(dirA, HIGH);
  digitalWrite(dirB, HIGH);
  analogWrite(pwmA, vit);
  analogWrite(pwmB, vit);
}

void halt() {
  //Serial.println("Arret !");
  analogWrite(pwmA, 0);
  analogWrite(pwmB, 0);
 }
 
void laser(){
    long somme =lsttime+timeout;
    if(laserOn==1 && millis()<somme){
        digitalWrite(8,HIGH); 
         Serial.print("millis: ");  
        Serial.println(millis());   
                 Serial.print("somme: ");  
        Serial.println(somme);  
    }
    if(laserOn==1&&millis()>somme){
        digitalWrite(8,LOW);
        laserOn=0;
        lsttime=0;
     }
}



