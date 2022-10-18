let kemona;
let fbo1, fbo2, fbo3;
let cam1, cam2;
function preload() {
    kemona = loadImage('images/KemonaPlush.jpg');
}
function setup() {
    createCanvas(1800, 600, WEBGL);
    // frame buffer object instances (FBOs)
    fbo1 = createGraphics(600, 600, WEBGL);
    fbo2 = createGraphics(600, 600, WEBGL);
    fbo3 = createGraphics(600, 600, WEBGL);
    fbo3.ortho(-fbo3.width / 2, fbo3.width / 2, -fbo3.height / 2, fbo3.height / 2, 1, 10000);
    // FBOs cams
    cam1 = new Dw.EasyCam(fbo2._renderer);
    let state1 = cam1.getState();
    cam1.attachMouseListeners(this._renderer);
    cam1.state_reset = state1;   // state to use on reset (double-click/tap)
    cam1.setViewport([100, 100, 400, 400]);
    cam2 = new Dw.EasyCam(fbo3._renderer, { rotation: [0.94, 0.33, 0, 0] });
    cam2.attachMouseListeners(this._renderer);
    let state2 = cam2.getState();
    cam2.state_reset = state2;   // state to use on reset (double-click/tap)
    cam2.setViewport([1200, 0, 600, 600]);
    document.oncontextmenu = function () { return false; }
    colorMode(RGB, 1);
}

function draw() {
    background(120);
    fbo2.background(0);
    fbo2.reset();
    fbo2.rotateZ(frameCount * 0.01);
    fbo2.rotateX(frameCount * 0.01);
    fbo2.rotateY(frameCount * 0.01);
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
    fbo3.viewFrustum({ fbo: fbo2, bits: Tree.NEAR | Tree.FAR });
    fbo3.pop();
    fbo3.rotateZ(frameCount * 0.01);
    fbo3.rotateX(frameCount * 0.01);
    fbo3.rotateY(frameCount * 0.01);
    fbo3.texture(kemona);
    fbo3.box(150);
    beginHUD();
    image(fbo3, 1200, 0);
    endHUD();

    fbo1.background(120);
    fbo1.reset();
    fbo1.texture(fbo2);
    fbo1.push();
    fbo1.circle(0, 0, 400);
    fbo1.pop();
    beginHUD();
    image(fbo1, 0, 0);
    endHUD();
}