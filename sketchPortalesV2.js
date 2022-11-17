let press = 0;
let changeCam = 0;
let angle = 0;
let kemonaSilver;
let player1, player2;
let fbo1, fbo2;

// obje model
let fox;
let cat;
// texture
let fox_tex;
let cat_tex;

let cam1, cam2, cam3;
let onCam1 = true, onCam2 = false;
let dummy;
function preload() {
    kemonaSilver = loadImage('images/KemonaPlushSilver.jpg');
    fox_tex = loadImage('models/fox.png');
    fox = loadModel('models/fox.obj', true);
    cat_tex = loadImage('models/cat_plush_01.png');
    cat = loadModel('models/catPlush.obj', true);
}
function setup() {
    createCanvas(900, 900, WEBGL);
    dummy = createGraphics(1, 1, WEBGL);
    fbo1 = createGraphics(900, 900, WEBGL);
    fbo1TextPort1 = createGraphics(900, 900, WEBGL);
    fbo1TextPort2 = createGraphics(900, 900, WEBGL);

    player1 = new Player(0, 0, 100);
    player2 = new Player(0, 0, 100);
    portalOnfbo1 = new Portal(-440, 0, 0, HALF_PI);
    portalOnfbo2 = new Portal(440, 0, 0, -HALF_PI);
    portalOnfbo1.link(portalOnfbo2);

    cam1 = fbo1.createCamera();
    cam2 = new Dw.EasyCam(fbo1._renderer, { distance: 500 });
    cam2.attachMouseListeners(this._renderer);
    let state2 = cam2.getState();
    cam2.state_reset = state2;   // state to use on reset (double-click/tap)
    cam2.setViewport([0, 0, 900, 900]);
    // cam3 = new Dw.EasyCam(fbo2._renderer, { distance: 500 });
    // cam3.attachMouseListeners(this._renderer);
    // let state3 = cam3.getState();
    // cam3.state_reset = state3;   // state to use on reset (double-click/tap)
    // cam3.setViewport([900, 0, 900, 900]);
}

function draw() {
    scene(fbo1);
    // scene(fbo2);

    player1.movement();
    player1.render(fbo1);
    if (player1.playerPos != 0) {
        player2.pos = player1.pos
        player2.a = player1.a
        // player2.render(fbo2);
    }
    angle += 0.007
    portalOnfbo1.render(fbo1, 0, fbo1)
    let camCoor = camFovCoordinates(-900, player1.pos, -player1.a, -60, 40);
    cam1.camera(camCoor.xp, camCoor.yp, camCoor.zp, camCoor.xc, camCoor.yc, camCoor.zc, camCoor.xn, camCoor.yn, camCoor.zn)
    if (changeCam) {
        if (onCam1) {
            cam2.setCanvas(dummy._renderer);
            fbo1.setCamera(cam1)
            onCam1 = false;
            onCam2 = true;
        } else {
            if (onCam2) {
                fbo1.reset();
                cam2.setCanvas(fbo1._renderer);
                onCam1 = true;
                onCam2 = false;
            }
        }
        changeCam = 0;
    }
    if (press) {
        console.log({ x: player.pos.x, y: player.pos.y, z: player.pos.z });
        console.log({ angle: player.a });
        let v = p5.Vector.fromAngle(player.a);
        console.log({ x: v.x, y: v.y, z: v.z });
        press = 0;
    }
    beginHUD();
    image(fbo1, 0, 0);
    endHUD();
    // beginHUD();
    // image(fbo2, 900, 0);
    // endHUD();
}
class Player {
    constructor(x, y, z) {
        this.pos = createVector(x, y, z);
        this.prevPos = this.pos.copy();
        this.a = 0;
        this.speed = 3;
        this.aspeed = PI / 90;
        this.playerPos = this.pos;
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
        fbo.noStroke();
        fbo.push();
        fbo.rotateZ(PI);
        fbo.rotateY(HALF_PI);
        fbo.texture(fox_tex);
        fbo.model(fox);
        fbo.pop();
        fbo.pop();
    }
}
class Portal {
    constructor(x, y, z, a) {
        this.pos = createVector(x, y, z);
        this.len = 220;
        this.a = a;
        this.portalPos = 0;
        this.linkedPortal = null;
    }

    link(other) {
        this.linkedPortal = other;
        other.linkedPortal = this;
    }

    check_(player) {
        const relativePos = player.playerPos.copy();
        relativePos.sub(this.portalPos);
        relativePos.rotate(-this.a);
        const relativePrevPos = player.prevPos.copy();
        relativePrevPos.sub(this.portalPos);
        relativePrevPos.rotate(-this.a);
        if ((relativePos.z < 28) !== (relativePrevPos.z < 28) && abs(relativePos.x) < this.len / 2) {
            console.log("Teletransportado");
            player.a += this.linkedPortal.a - this.a;
            return true;
        }
        return false;
    }

    check(player) {
        return this.check_(player);
    }

    render(fbo, numberPortal, texElement) {
        fbo.push()
        fbo.translate(this.pos.x, this.pos.y, this.pos.z);
        fbo.rotateY(this.a);
        fbo.push()
        fbo.translate(0, 0, -1);
        if (numberPortal === 0) {
            fbo.fill(0, 0, 255)
        } else {
            fbo.fill(255, 158, 0)
        }
        fbo.circle(0, 0, 260)
        fbo.pop()
        if (texElement) {
            fbo.texture(texElement);
        }
        fbo.circle(0, 0, 250)
        this.portalPos = fbo.treeLocation(/*[0, 0, 0],*/ { from: Tree.MODEL, to: Tree.WORLD });
        fbo.pop()
    }
}
function scene(fbo) {
    fbo.background(120);
    fbo.reset();
    fbo.rectMode(CENTER);
    fbo.ambientLight(255);
    fbo.noStroke();
    fbo.push();
    fbo.rotateZ(angle)
    fbo.rotateX(angle)
    fbo.rotateY(angle)
    fbo.texture(kemonaSilver)
    fbo.box(100)
    fbo.pop();
    fbo.push();
    fbo.translate(-350, 0, -350);
    fbo.rotateZ(angle)
    fbo.rotateX(angle)
    fbo.rotateY(angle)
    fbo.texture(cat_tex)
    fbo.model(cat);
    fbo.pop();
    fbo.push();
    fbo.noStroke();
    fbo.ambientLight(255);
    fbo.ambientMaterial(100);
    fbo.translate(0, 100);
    fbo.rotateX(HALF_PI);
    fbo.plane(900, 900);
    fbo.pop();
}
function keyPressed() {
    if (keyCode === 67) {
        if (changeCam === 0) {
            changeCam = 1;
        }
    }
    if (keyCode === 73) {
        if (press === 0) {
            press = 1;
        }
    }
}
function camFovCoordinates(radio, posVec, angle, hy, chy) {
    let vecAngle = p5.Vector.fromAngle(angle);
    let radioCam = -10;
    return { xp: (posVec.x + (radioCam * vecAngle.x)), yp: posVec.y + hy, zp: (posVec.z + (radioCam * vecAngle.y)), xc: (posVec.x + (radio * vecAngle.x)), yc: posVec.y + chy, zc: (posVec.z + (radio * vecAngle.y)), xn: 0, yn: 1, zn: 0 };
}