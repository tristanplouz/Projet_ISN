#include <SPI.h>
#include <WiFi.h>
#include <WiFiUdp.h>

int status = WL_IDLE_STATUS;
char ssid[] = "tristan-PC";
char pass[] = "wRq8FTlt";
unsigned int localPort = 5678;

char packetBuffer[255];
char HelloBuffer[] = "helloa01";

WiFiUDP Udp;

int dirA = 2,
    dirB = 4,
    pwmA = 3,
    pwmB = 5;

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
    status = WiFi.begin(ssid, pass);
    delay(5000);
  }
  Serial.println("Connecté au réseau wifi");
  printWifiStatus();

  Serial.println("\nTentative d'ouverture du socket...");
  while (!Udp.begin(localPort)) {
    Serial.println("Echec");
    delay(2000);
  }
  Serial.println("Socket ouvert, la communication peut commencer");

  Serial.println("\nEnvoi du packet hello");
  Serial.println(Udp.remoteIP());
  Udp.beginPacket("10.42.0.255", localPort);//Faire un script pour mettre l'ip de broadcast automatiquement
  Udp.write(HelloBuffer);
  if (Udp.endPacket()) {
    Serial.println("Packet envoyé");
  }
}

void loop() {

  int packetSize = Udp.parsePacket();
  if (packetSize) {
    Serial.print("\nPacket UDP recu, Taille : ");
    Serial.println(packetSize);
    Serial.print("Emetteur : ");
    IPAddress remoteIp = Udp.remoteIP();
    Serial.print(remoteIp);
    Serial.print(", Port : ");
    Serial.println(Udp.remotePort());

    int len = Udp.read(packetBuffer, 255);
    if (len > 0) {
      packetBuffer[len] = 0;
    }
    Serial.println("Contenu : ");
    Serial.println(String(packetBuffer));

    if (String(packetBuffer) == "1") {
      forward(255);
    }
    if (String(packetBuffer) == "2") {
        back(255);
      delay(1);
    }
    if (String(packetBuffer) == "4") {
      right(255);
    }
    if (String(packetBuffer) == "3") {
      left(255);
    }
    if (String(packetBuffer) == "5") {
      halt();
    }
  }
  delay(10);
}


void printWifiStatus() {
  Serial.print("SSID : ");
  Serial.println(WiFi.SSID());

  IPAddress ip = WiFi.localIP();
  Serial.print("Adresse IP : ");
  Serial.println(ip);

  long rssi = WiFi.RSSI();
  Serial.print("Intensité du signal : ");
  Serial.print(rssi);
  Serial.println(" dBm");
}

void forward(int vit) {
  Serial.println("Avance !");
  digitalWrite(9, LOW);
  digitalWrite(8, LOW);
  digitalWrite(dirA, LOW);
  digitalWrite(dirB, LOW);
  analogWrite(pwmA, vit);
  analogWrite(pwmB, vit);
}

void right(int vit) {
  Serial.println("Droite !");
  digitalWrite(9, LOW);
  digitalWrite(8, LOW);
  digitalWrite(dirA, HIGH);
  digitalWrite(dirB, LOW);
  analogWrite(pwmA, vit);
  analogWrite(pwmB, vit);
}

void left(int vit) {
  Serial.println("Gauche !");
  digitalWrite(9, LOW);
  digitalWrite(8, LOW);
  digitalWrite(dirA, LOW);
  digitalWrite(dirB, HIGH);
  analogWrite(pwmA, vit);
  analogWrite(pwmB, vit);
}

void back(int vit) {
  Serial.println("Recule !");
  digitalWrite(9, LOW);
  digitalWrite(8, LOW);
  digitalWrite(dirA, HIGH);
  digitalWrite(dirB, HIGH);
  analogWrite(pwmA, vit);
  analogWrite(pwmB, vit);
}

void halt() {
  Serial.println("Arret !");
  analogWrite(pwmA, 0);
  analogWrite(pwmB, 0);
  digitalWrite(9, HIGH);
  digitalWrite(8, HIGH);
}
void initH() {
  pinMode(dirA, OUTPUT);
  pinMode(dirB, OUTPUT);
  pinMode(pwmA, OUTPUT);
  pinMode(pwmB, OUTPUT);
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
}



