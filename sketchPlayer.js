let press = 0;
let angle = 0;
let kemonaSilver;
let player;

// obje model
let fox;
// texture
let fox_tex;

let cam1, cam2;
let boxPOS, disPOS;
let dummy;
function preload() {
    kemonaSilver = loadImage('images/KemonaPlushSilver.jpg');
    fox_tex = loadImage('models/fox.png');
    fox = loadModel('models/fox.obj', true);
}
function setup() {
    createCanvas(900, 900, WEBGL);
    dummy = createGraphics(1, 1, WEBGL);

    player = new Player(100, 0, 100);

    cam1 = createCamera();
    cam2 = new Dw.EasyCam(this._renderer, { distance: 500 });
    cam2.attachMouseListeners(this._renderer);
    let state2 = cam2.getState();
    cam2.state_reset = state2;   // state to use on reset (double-click/tap)
}

function draw() {
    background(120);
    rectMode(CENTER);
    ambientLight(255);
    noStroke();
    push()
    rotateZ(angle)
    rotateX(angle)
    rotateY(angle)
    texture(kemonaSilver)
    box(100)
    pop();
    push();
    noStroke();
    ambientLight(255);
    ambientMaterial(100);
    translate(0, 100);
    rotateX(HALF_PI);
    plane(700, 700);
    pop();
    player.movement();
    player.render(this);
    angle += 0.007
    if (press) {
        cam3.setCanvas(dummy._renderer)
        setCamera(cam1)
        press = 0;
    }
}
class Player {
    constructor(x, y, z) {
        this.pos = createVector(x, y, z);
        this.prevPos = this.pos.copy();
        this.a = 0;
        this.speed = 3;
        this.aspeed = PI / 90;
        this.playerPos = 0;
        this.playerDis = 0;
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
        if (this.pos.z < -410) {
            this.pos.z = -410
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
        this.playerPos = fbo.treeLocation(/*[0, 0, 0],*/ { from: Tree.MODEL, to: Tree.WORLD });
        this.playerDis = fbo.treeDisplacement(/*[0, 0, 0],*/ { from: Tree.MODEL, to: Tree.WORLD });
        fbo.pop();
        fbo.pop();
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
    if (keyCode === 73) {
        if (press === 0) {
            press = 1;
        }
    }
}