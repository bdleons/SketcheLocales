let dog;
let kemona;
let pg;
let camPG, camMain;
function preload(){
    dog = loadImage('images/perro.jpg');
    kemona = loadImage('images/KemonaPlush.jpg');
}
function setup() {
    createCanvas(900, 700, WEBGL);
    pg = createGraphics(400, 400, WEBGL);
    // camMain = new Dw.EasyCam(this._renderer);
    // camMain.setViewport([0, 0, 900, 700]);
    camPG = new Dw.EasyCam(pg._renderer, { distance: 200 });
    let state1 = camPG.getState();
    camPG.attachMouseListeners(this._renderer);
    camPG.state_reset = state1;   // state to use on reset (double-click/tap)
    camPG.setViewport([200, 200, 400, 400]);
}

function draw() {
    background(120);
    pg.background(0);
    pg.reset();
    pg.rotateZ(10);
    pg.rotateX(10);
    pg.rotateY(10);
    pg.texture(kemona);
    pg.box(100);
    //imgSomething = createImg(pg,'');
    texture(pg);
    push()
    // translate(-450, 0)
    circle(0, 0, 400);
    // ellipse(0, 0, 350, 470);
    pop()
}