let press = 0;
let kemona;
let fbo1, fbo2, fbo3;
let cam1, cam2, cam3;
function preload() {
    kemona = loadImage('images/KemonaPlush.jpg');
}
{
    var xr = -0.5;
    var yr = 0;
    var d = true;
    var f = true;
    var z = 40;
    var fx, fy, ly, lx = 0;
    var mdo = false;
}

function setup() {
    createCanvas(1200, 600, WEBGL);
    fbo1 = createGraphics(600, 600, WEBGL);
    fbo2 = createGraphics(600, 600, WEBGL);
    fbo3 = createGraphics(600, 600, WEBGL);

    // cam3 for fbo3 // EasyCam P5
    cam2 = new Dw.EasyCam(fbo2._renderer, { rotation: [0.94, 0.33, 0, 0] });
    cam2.attachMouseListeners(this._renderer);
    let state2 = cam2.getState();
    cam2.state_reset = state2;   // state to use on reset (double-click/tap)
    cam2.setViewport([600, 0, 600, 600]);




    update(fbo1);

}

function mouseWheel(event) {
    if (z > 1 || event.delta < 0) {
        z -= event.delta / 25;
    }
    else {
        z = 2;
    }
    if (z < 199 || event.delta > 0) {
        z -= event.delta / 25;
    }
    else {
        z = 200;
    }
    update(fbo1);
}

function mousePressed() {
    mdo = true;
    if (press === 0) {
        press = 1;
    }
}

function mouseReleased() {
    mdo = false;
}

function light(fbo) {
    fbo.pointLight(255, 255, 255, 0, 0, 300);
    fbo.pointLight(255, 255, 255, 0, 0, 300);
    fbo.pointLight(255, 255, 255, 0, 0, 300);
}

function drawSubjects(fbo) {

    fbo.rotateY(PI);
    fbo.noStroke();
    fbo.ambientMaterial(0, 0, 255);
    fbo.box(z * 10, z / 10, z * 10);

    fbo.ambientMaterial(0, 255, 0);
    fbo.translate(0, -(z / 10), 0);
    fbo.rotateX(HALF_PI);
    fbo.plane(z * 10);

    fbo.translate((z * 5) - (z / 2), (z) - (z / 2), z / 2);
    fbo.ambientMaterial(255, 0, 0);

    for (var i = 0; i < 3; i++) {
        fbo.box(z, z * 9, z);
        fbo.translate(-(z * 5), (z * 4), 0);
        fbo.rotateZ(HALF_PI);
    }

    fbo.translate(0, z / 2, 0);
    fbo.box(z, z * 8, z);
    fbo.translate(-z, -(z * 3 + z / 2), 0);
    fbo.box(z);
    fbo.translate(-z * 2, 0, 0);
    fbo.box(z, z * 2, z);
}

function align(fbo) {
    fbo.rotateX(xr);
    //delete as necessary
    fbo.rotateY(yr);
    //or
    //rotateZ(yr);
}

function senseMouse() {
    if (mdo) {
        if (f) {
            fx = (-(mouseY - 200) * 0.01);
            fy = ((mouseX - 200) * 0.01);
            f = false;
        }
        d = true;
        adjx = (-(mouseY - 200) * 0.01);
        adjy = ((mouseX - 200) * 0.01);
        adjx -= fx;
        adjy -= fy;
        yr = ly + adjy;
        xr = lx + adjx;
    }
    else if (d) {
        lx = xr;
        ly = yr;
        d = false;
        f = true;
    }
}

function update(fbo) {
    fbo.background(120);
    fbo.reset();
    senseMouse();
    light(fbo);
    align(fbo);
    drawSubjects(fbo);
}
function draw() {
    beginHUD();
    image(fbo1, 0, 0);
    endHUD();
    update(fbo1)

    let cam1POS = fbo1.treeLocation(/*[0, 0, 0],*/ { from: Tree.CAM, to: Tree.WORLD });
    let cam2POS = fbo2.treeLocation(/*[0, 0, 0],*/ { from: Tree.CAM, to: Tree.WORLD });
    let somePOS = fbo1.treeLocation(/*[0, 0, 0],*/ { from: Tree.MODEL, to: Tree.WORLD });

    if (press) {
        console.log(cam1POS);
        console.log(cam2POS);
        console.log(somePOS);
        press = 0;
    }

    fbo2.background(130);
    fbo2.reset();
    fbo2.axes();
    fbo2.grid();
    fbo2.push();
    fbo2.strokeWeight(3);
    fbo2.stroke('magenta');
    fbo2.fill(color(1, 0, 1, 0.3));
    fbo2.texture(kemona);
    fbo2.viewFrustum({ fbo: fbo1, bits: Tree.NEAR | Tree.FAR });
    fbo2.pop();
    fbo2.push();
    fbo2.translate(0, -20);
    fbo2.rotateZ(10);
    fbo2.rotateX(10);
    fbo2.rotateY(10);
    fbo2.texture(kemona);
    fbo2.box(150);
    fbo2.pop();
    beginHUD();
    image(fbo2, 600, 0);
    endHUD();
}