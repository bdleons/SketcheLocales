let press = 0;
let fbo1, fbo2, fbo3;
let cam1, cam2, cam3;
let angle = 0;
let dog;
let kemona;
let boxPOS, disPOS;
function preload() {
    dog = loadImage('images/perro.jpg');
    kemona = loadImage('images/KemonaPlush.jpg');
}
function setup() {
    createCanvas(900, 900, WEBGL);
}

function draw() {
    background(120);
    rectMode(CENTER);
    ambientLight(255);
    noStroke();
    push()
    translate(200, 200)
    rotateZ(angle)
    rotateX(angle)
    rotateY(angle)
    texture(dog)
    sphere(200)
    let spherePOS = treeLocation(/*[0, 0, 0],*/ { from: Tree.MODEL, to: Tree.WORLD });
    pop()
    if(true){
        push()
        translate(-100, -100)
        rotateZ(angle)
        rotateX(angle)
        rotateY(angle)
        texture(kemona)
        box(250)
        boxPOS = treeLocation(/*[0, 0, 0],*/ { from: Tree.MODEL, to: Tree.WORLD });
        disPOS = treeDisplacement(/*[0, 0, 0],*/ { from: Tree.MODEL, to: Tree.WORLD });
        pop()
    }
    angle += 0.007
    let somePOS = treeLocation(/*[0, 0, 0],*/ { from: Tree.MODEL, to: Tree.WORLD });
    if (press) {
        // console.log(somePOS);
        // console.log(spherePOS);
        console.log(boxPOS);
        console.log(disPOS);
        press = 0;
    }
}
function mousePressed() {
    if (press === 0) {
        press = 1;
    }
}