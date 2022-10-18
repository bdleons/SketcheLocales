let angle = 0;
let dog;
let kemona;
function preload(){
    dog = loadImage('images/perro.jpg');
    kemona = loadImage('images/KemonaPlush.jpg');
}
function setup() {
    createCanvas(900, 700, WEBGL);
}

function draw() {
    background(120);
    rectMode(CENTER);
    ambientLight(255);
    noStroke();
    rotateZ(angle)
    rotateX(angle)
    rotateY(angle)
    push()
    translate(200, 200)
    rotateZ(angle)
    rotateX(angle)
    rotateY(angle)
    texture(dog)
    sphere(200)
    pop()
    push()
    translate(-100, -100)
    rotateZ(angle)
    rotateX(angle)
    rotateY(angle)
    texture(kemona)
    box(250)
    pop()
    angle += 0.007
}