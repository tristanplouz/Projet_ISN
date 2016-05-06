int dirA = 12,
    dirB = 13,
    pwmA = 3,
    pwmB = 11;

void setup() {
  // put your setup code here, to run once:
  pinMode(dirA, OUTPUT);
  pinMode(dirB, OUTPUT);
  pinMode(pwmA, OUTPUT);
  pinMode(pwmB, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  avancer(200);
  delay(2000);
  halt();
  reculer(200);
  delay(2000);
  halt();

}
void avancer(int vit) {
          digitalWrite(9, LOW);
  digitalWrite(8, LOW);
  digitalWrite(dirA, LOW);
  digitalWrite(dirB, LOW);
  analogWrite(pwmA, vit);
  analogWrite(pwmB, vit);
}
void droite(int vit) {
          digitalWrite(9, LOW);
  digitalWrite(8, LOW);
  digitalWrite(dirA, HIGH);
  digitalWrite(dirB, LOW);
  analogWrite(pwmA, vit);
  analogWrite(pwmB, vit);
}
void gauche(int vit) {
          digitalWrite(9, LOW);
  digitalWrite(8, LOW);
  digitalWrite(dirA, LOW);
  digitalWrite(dirB, HIGH);
  analogWrite(pwmA, vit);
  analogWrite(pwmB, vit);
}
void reculer(int vit) {
      digitalWrite(9, LOW);
  digitalWrite(8, LOW);
  digitalWrite(dirA, HIGH);
  digitalWrite(dirB, HIGH);
  analogWrite(pwmA, vit);
  analogWrite(pwmB, vit);
}
void halt() {
  analogWrite(pwmA, 0);
  analogWrite(pwmB, 0);
  digitalWrite(9, HIGH);
  digitalWrite(8, HIGH);
delay(100);}
