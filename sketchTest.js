const DEFAULT_CAM_POS = ( 0,0,500, 0,0,0, 0,1,0 ); 
let press = 0;
let panCamX = 0;
let count = 0;
let dog;
let kemona;
let fbo1, fbo2, fbo3;
let cam1, cam2, cam3;
function preload() {
    kemona = loadImage('images/KemonaPlush.jpg');
}
function setup() {
    createCanvas(1800, 600, WEBGL);
    // frame buffer object instances (FBOs)
    fbo1 = createGraphics(600, 600, WEBGL);
    fbo2 = createGraphics(600, 600, WEBGL);
    fbo3 = createGraphics(600, 600, WEBGL);
    fbo4 = createGraphics(100, 100, WEBGL);
    fbo3.ortho(-fbo3.width / 2, fbo3.width / 2, -fbo3.height / 2, fbo3.height / 2, 1, 10000);
    // FBOs cams
    // cam1 for fbo1 // EasyCam P5
    // cam1 = new Dw.EasyCam(fbo1._renderer);
    // cam1.attachMouseListeners(this._renderer);
    // let state1 = cam1.getState();
    // cam1.state_reset = state1;   // state to use on reset (double-click/tap)
    // cam1.setViewport([0, 0, 700, 700]);

    cam1 = fbo1.createCamera(); // LegacyCam P5

    // cam2 for fbo2 // EasyCam P5
    cam2 = new Dw.EasyCam(fbo2._renderer);
    let state2 = cam2.getState();
    cam2.attachMouseListeners(this._renderer);
    cam2.state_reset = state2;   // state to use on reset (double-click/tap)
    cam2.setViewport([800, 100, 400, 400]);

    // cam2 = fbo2.createCamera(); // LegacyCam P5

    // cam3 for fbo3 // EasyCam P5
    cam3 = new Dw.EasyCam(fbo3._renderer, { rotation: [0.94, 0.33, 0, 0] });
    cam3.attachMouseListeners(this._renderer);
    let state3 = cam3.getState();
    cam3.state_reset = state3;   // state to use on reset (double-click/tap)
    cam3.setViewport([1200, 0, 600, 600]);

    // cam3 = fbo3.createCamera(); // LegacyCam P5

    document.oncontextmenu = function () { return false; }
    colorMode(RGB, 1);
}

function draw() {


    // cam1.lookAt(0, 0, 0);
    // cam1.setPosition(sin(frameCount / 60) * 200, 0, 100)
    let cam1POS = fbo1.treeLocation(/*[0, 0, 0],*/ { from: Tree.CAM, to: Tree.WORLD });
    let camX = map(mouseX, 0, 700, -200, 200);
    cam1.camera(camX,0,500, 0,0,0, 0,1,0)
    if (press) {
        // console.log(cam1.getPosition());
        // console.log(cam1.getRotation());
        console.log(cam1.eyeX + ',' + cam1.eyeY + ',' + cam1.eyeZ);
        console.log(cam1POS);
        press = 0;
        panCamX = 0;
        count += 1;
    }
    background(120);
    fbo4.background('magenta')
    fbo2.background(0);
    fbo2.reset();
    fbo2.rotateZ(10);
    fbo2.rotateX(10);
    fbo2.rotateY(10);
    fbo2.texture(kemona);
    fbo2.box(150);
    beginHUD();
    image(fbo2, 600, 0);
    endHUD();

    fbo3.background(130);
    fbo3.reset();
    fbo3.axes();
    fbo3.grid();
    fbo3.push();
    fbo3.strokeWeight(3);
    fbo3.stroke('magenta');
    fbo3.fill(color(1, 0, 1, 0.3));
    // fbo3.texture(fbo4);
    fbo3.viewFrustum({ fbo: fbo2, bits: Tree.NEAR | Tree.FAR });
    fbo3.pop();
    fbo3.rotateZ(10);
    fbo3.rotateX(10);
    fbo3.rotateY(10);
    fbo3.texture(kemona);
    fbo3.box(150);
    beginHUD();
    image(fbo3, 1200, 0);
    endHUD();

    fbo1.background(120);
    fbo1.reset();
    fbo1.push();
    fbo1.image(fbo2, -200, -200, 400, 400);
    fbo1.pop();
    fbo1.push();
    fbo1.noStroke();
    fbo1.ambientLight(255);
    fbo1.ambientMaterial(100);
    fbo1.translate(0, 100);
    fbo1.rotateX(HALF_PI);
    fbo1.plane(700, 700);
    fbo1.pop();
    beginHUD();
    image(fbo1, 0, 0);
    endHUD();
}
function mousePressed() {
    if (press === 0) {
        press = 1;
        if (count % 2 === 0) {
            panCamX = 100;
        } else {
            panCamX = -100;
        }
    }
}