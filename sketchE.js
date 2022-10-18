let press = 0;
let dog;
let kemona;
let pg;
let camPG, camMain, camOfPG1, camOfPG2;
function preload(){
    kemona = loadImage('images/KemonaPlush.jpg');
}
function setup() {
    createCanvas(900, 700, WEBGL);
    pg = createGraphics(400, 400, WEBGL)
    // auxCan = createGraphics(400, 400, WEBGL)
    camOfPG1 = pg.createCamera();
    camOfPG2 = pg.createCamera();
    camPG = createCamera();
    camMain = createCamera();
}

function draw() {
    camPG.lookAt(0, 0, 0);
    camPG.setPosition(sin(frameCount / 60) * 200, 0, 100)
    camOfPG1.lookAt(0, 0, 0);
    camOfPG1.setPosition(sin(frameCount / 60) * 200, 0, 100)
    background(120);
    setCamera(camMain);
    push();
    translate(-200, -200)
    rotateZ(frameCount * 0.01);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    texture(kemona);
    box(100);
    pop();

    pg.background(0);
    pg.reset()

    if(press){
        pg.setCamera(camOfPG1);
    }else{
        pg.setCamera(camOfPG2);
    }
    pg.rotateZ(10);
    pg.rotateX(10);
    pg.rotateY(10);
    pg.texture(kemona);
    pg.box(100);
    image(pg, 0,0)

}
function mousePressed(){
    if(press === 0){
        press = 1;
    }else{
        press = 0;
    }
}