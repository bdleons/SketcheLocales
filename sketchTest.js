let player;
let press = 0;
let angle = 0;
let kemonaSilver;
let kemonaRed;
let renderFbo1 = 0;

// obje model
let fox;
// texture
let fox_tex;

let modelPOS, modelDis;

let fbo1, fbo2, fbo3;
let cam1, cam2, cam3;

function preload() {
    kemonaSilver = loadImage('images/KemonaPlushSilver.jpg');
    kemonaRed = loadImage('images/KemonaPlushRed.jpg');
    fox_tex = loadImage('models/fox.png');
    fox = loadModel('models/fox.obj', true);
}
function setup() {
    createCanvas(1200, 600, WEBGL);
    // frame buffer object instances (FBOs)
    fbo1 = createGraphics(600, 600, WEBGL);
    fbo2 = createGraphics(600, 600, WEBGL);
    fbo3 = createGraphics(600, 600, WEBGL);
    fbo4 = createGraphics(100, 100, WEBGL);
    fbo3.ortho(-fbo3.width / 2, fbo3.width / 2, -fbo3.height / 2, fbo3.height / 2, 1, 10000);
    // FBOs cams
    // cam1 for fbo1 // EasyCam P5
    cam1 = new Dw.EasyCam(fbo1._renderer);
    cam1.attachMouseListeners(this._renderer);
    let state1 = cam1.getState();
    cam1.state_reset = state1;   // state to use on reset (double-click/tap)
    cam1.setViewport([0, 0, 600, 600]);

    // cam1 = fbo1.createCamera(); // LegacyCam P5

    // cam2 for fbo2 // EasyCam P5
    cam2 = new Dw.EasyCam(fbo2._renderer);
    let state2 = cam2.getState();
    cam2.attachMouseListeners(this._renderer);
    cam2.state_reset = state2;   // state to use on reset (double-click/tap)
    cam2.setViewport([600, 0, 600, 600]);

    // cam2 = fbo2.createCamera(); // LegacyCam P5

    // cam3 for fbo3 // EasyCam P5
    // cam3 = new Dw.EasyCam(fbo3._renderer, { rotation: [0.94, 0.33, 0, 0] });
    // cam3.attachMouseListeners(this._renderer);
    // let state3 = cam3.getState();
    // cam3.state_reset = state3;   // state to use on reset (double-click/tap)
    // cam3.setViewport([1200, 0, 600, 600]);

    // cam3 = fbo3.createCamera(); // LegacyCam P5

    player = new Player(100, 0, 100);

    document.oncontextmenu = function () { return false; }
    colorMode(RGB, 1);
}

function draw() {

    scene(fbo1, 1, 0);
    scene(fbo2, 0, 0);

    if (renderFbo1) {
        player.movement();
        player.render(fbo1);
    }

    if (press) {
        console.log(modelPOS);
        console.log(modelDis);
        press = 0;
    }
    angle += 0.007
    beginHUD();
    image(fbo1, 0, 0);
    endHUD();
    beginHUD();
    image(fbo2, 600, 0);
    endHUD();
}
class Player {
    constructor(x, y, z) {
        this.pos = createVector(x, y, z);
        this.prevPos = this.pos.copy();
        this.a = 0;
        this.speed = 3;
        this.aspeed = PI / 90;
    }

    move(fw) {
        this.prevPos.set(this.pos);
        const vel = p5.Vector.fromAngle(this.a);
        if (fw) {
            vel.mult(this.speed);
            this.pos.add(-vel.x, 0, vel.y);
        } else {
            vel.mult(this.speed);
            this.pos.add(vel.x, 0, -vel.y);
        }
        if (this.pos.x > 400) {
            this.pos.x = 400
        }
        if (this.pos.z > 400) {
            this.pos.z = 400
        }
        if (this.pos.x < -400) {
            this.pos.x = -400
        }
        if (this.pos.z < -400) {
            this.pos.z = -400
        }
    }

    movement() {
        if (keyIsDown(LEFT_ARROW))
            this.turn(1);
        if (keyIsDown(RIGHT_ARROW))
            this.turn(-1);
        if (keyIsDown(UP_ARROW))
            this.move(true);
        if (keyIsDown(DOWN_ARROW))
            this.move(false);
    }

    turn(dir) {
        this.a += dir * this.aspeed;
    }

    render(fbo) {
        fbo.push();
        fbo.translate(this.pos.x, this.pos.y, this.pos.z);
        fbo.rotateY(this.a);
        fbo.push();
        fbo.noStroke();
        fbo.rotateZ(PI);
        fbo.rotateY(HALF_PI);
        fbo.push();
        fbo.stroke('purple');
        fbo.axes({ size: 200 });
        fbo.pop();
        fbo.texture(fox_tex);
        fbo.model(fox);
        modelPOS = fbo1.treeLocation(/*[0, 0, 0],*/ { from: Tree.MODEL, to: Tree.WORLD });
        modelDis = fbo1.treeDisplacement(/*[0, 0, 0],*/ { from: Tree.MODEL, to: Tree.WORLD });
        fbo.pop();
        fbo.pop();
    }
}
function scene(fbo, centerObject, frontWall) {
    fbo.background(120);
    fbo.reset();
    fbo.rectMode(CENTER);
    fbo.ambientLight(255);
    fbo.noStroke();
    fbo.push()
    fbo.rotateZ(angle)
    fbo.rotateX(angle)
    fbo.rotateY(angle)
    if(centerObject){
        fbo.texture(kemonaSilver)
        fbo.box(100)
    }else{
        fbo.texture(kemonaRed)
        fbo.box(100)
    }
    fbo.pop();
    // PISO
    fbo.push();
    fbo.stroke(2);
    fbo.ambientLight(255);
    fbo.ambientMaterial(100);
    fbo.translate(0, 110);
    fbo.rotateX(HALF_PI);
    fbo.box(900, 900, 20);
    fbo.pop();
    //Paredes
    if (frontWall) {
        // Frontal Z+
        fbo.push();
        fbo.stroke(2);
        fbo.ambientLight(255);
        fbo.ambientMaterial(100);
        fbo.translate(0, -25, 450);
        fbo.box(900, 250, 20);
        fbo.pop();
    }
    // Trasera Z-
    fbo.push();
    fbo.stroke(2);
    fbo.ambientLight(255);
    fbo.ambientMaterial(100);
    fbo.translate(0, -25, -450);
    fbo.box(900, 250, 20);
    fbo.pop();
    // Lateral Derecha X+
    fbo.push();
    fbo.stroke(2);
    fbo.ambientLight(255);
    fbo.ambientMaterial(100);
    fbo.translate(450, -25, 0);
    fbo.rotateY(HALF_PI);
    fbo.box(900, 250, 20);
    fbo.pop();
    // Trasera Izquierda X-
    fbo.push();
    fbo.stroke(2);
    fbo.ambientLight(255);
    fbo.ambientMaterial(100);
    fbo.translate(-450, -25, 0);
    fbo.rotateY(HALF_PI);
    fbo.box(900, 250, 20);
    fbo.pop();
}
function mousePressed() {
    if (press === 0) {
        press = 1;
    }
}
function keyPressed() {
    if (keyCode === 80) {
        if (renderFbo1 === 0) {
            renderFbo1 = 1
        } else {
            renderFbo1 = 0
        }
    }
}