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

let set1 = 0, set2 = 0;
let starCheck1 = 0, starCheck2 = 0;
let relativePosCon, relativePosSubCon, relativePosRotCon;
let relativePrevPosCon, relativePrevPosSubCon, relativePrevPosRotCon;
let teleportedFbo1 = false, teleportedFbo2 = true;
let fbo1, fbo2, fbo1TextPort, fbo2TextPort;
let cam1, cam2, cam1Off, cam2Off;
let cam1Pos, cam2Pos, cam1OffPos, cam2OffPos;

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
    fbo1TextPort = createGraphics(600, 600, WEBGL);
    fbo2TextPort = createGraphics(600, 600, WEBGL);
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

    cam1Off = fbo1TextPort.createCamera(); // LegacyCam P5
    cam2Off = fbo2TextPort.createCamera(); // LegacyCam P5

    playerOnfbo1 = new Player(100, 0, 100);
    playerOnfbo2 = new Player(0, 0, 0);
    playerOnfbo1Off = new Player(100, 0, 100);
    playerOnfbo2Off = new Player(0, 0, 0);
    portalOnfbo1 = new Portal(0, 0, -437, 0);
    portalOnfbo2 = new Portal(0, 0, -437, 0);
    portalOnfbo1.link(portalOnfbo2);

    cam1OffPos = fbo1TextPort.treeLocation(/*[0, 0, 0],*/ { from: Tree.CAM, to: Tree.WORLD });
    cam1Off.camera(cam1OffPos.x,cam1OffPos.y,-cam1OffPos.z, 0,0,0, 0,1,0)
    cam2OffPos = fbo2TextPort.treeLocation(/*[0, 0, 0],*/ { from: Tree.CAM, to: Tree.WORLD });
    cam2Off.camera(cam2OffPos.x,cam2OffPos.y,-cam2OffPos.z, 0,0,0, 0,1,0)

    document.oncontextmenu = function () { return false; }
    colorMode(RGB, 1);
}

function draw() {

    scene(fbo1TextPort, 1, 1, 0);
    scene(fbo2TextPort, 0, 1, 0);
    scene(fbo1, 1, 0, 1);
    scene(fbo2, 0, 0, 1);

    if (!teleportedFbo1 && teleportedFbo2) {
        if (set1) {
            playerOnfbo1.pos = playerOnfbo2.playerPos;
            playerOnfbo1.a = -playerOnfbo2.a;
            set1 = 0
        }
        playerOnfbo1.movement();
        playerOnfbo1.render(fbo1);
        if (playerOnfbo1.playerPos != 0) {
            playerOnfbo1Off.pos = playerOnfbo1.playerPos;
            playerOnfbo1Off.a = playerOnfbo1.a;
            playerOnfbo1Off.render(fbo1TextPort);
        }
        if (abs(playerOnfbo1.playerPos.z) < (abs(portalOnfbo1.portalPos.z) - 40)) {
            if (renderFbo1) {
                console.log("CheckActivado Portal 1");
                renderFbo1 = 0;
            }
            starCheck1 = 1;
        }
        if (starCheck1) {
            teleportedFbo1 = portalOnfbo1.check(playerOnfbo1)
        }
        if (teleportedFbo1) {
            teleportedFbo2 = false;
            starCheck1 = 0;
            set2 = 1;
        }
    }
    if (!teleportedFbo2 && teleportedFbo1) {
        if (set2) {
            playerOnfbo2.pos = playerOnfbo1.playerPos;
            playerOnfbo2.a = -playerOnfbo1.a;
            set2 = 0
        }
        playerOnfbo2.movement();
        playerOnfbo2.render(fbo2);
        if (playerOnfbo2.playerPos != 0) {
            playerOnfbo2Off.pos = playerOnfbo2.playerPos;
            playerOnfbo2Off.a = playerOnfbo2.a;
            playerOnfbo2Off.render(fbo2TextPort);
        }
        if (abs(playerOnfbo2.playerPos.z) < (abs(portalOnfbo2.portalPos.z) - 40)) {
            if (renderFbo1) {
                console.log("CheckActivado Portal 2");
                renderFbo1 = 0;
            }
            starCheck2 = 1;
        }
        if (starCheck2) {
            teleportedFbo2 = portalOnfbo2.check(playerOnfbo2)
        }
        if (teleportedFbo2) {
            teleportedFbo1 = false;
            starCheck2 = 0;
            set1 = 1;
        }
    }
    portalOnfbo1.render(fbo1, 0, fbo2TextPort);
    portalOnfbo2.render(fbo2, 1, fbo1TextPort);

    if (press) {
        console.log("Accediste a la informacion de los Player1");
        console.log(playerOnfbo1.playerDis);
        // console.log("Accediste a la informacion del Portal1");
        // console.log(portalOnfbo1.portalPos);
        // console.log("Informacion de Check Player");
        // console.log(relativePosCon);
        // console.log(relativePosSubCon);
        // console.log(relativePosRotCon);
        // console.log("Informacion de Check Player Previa");
        // console.log(relativePrevPosCon);
        // console.log(relativePrevPosSubCon);
        // console.log(relativePrevPosRotCon);
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
        relativePosCon = relativePos;
        relativePosSubCon = relativePos.sub(this.portalPos);
        relativePosRotCon = relativePos.rotate(-this.a);
        const relativePrevPos = player.prevPos.copy();
        relativePrevPosCon = relativePrevPos;
        relativePrevPosSubCon = relativePrevPos.sub(this.portalPos);
        relativePrevPosRotCon = relativePrevPos.rotate(-this.a);
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
        fbo.push()
        fbo.translate(this.pos.x, this.pos.y, -1);
        if (numberPortal === 0) {
            fbo.fill(0, 0, 255)
        } else {
            fbo.fill(255, 158, 0)
        }
        fbo.circle(this.pos.x, this.pos.y, 260)
        fbo.pop()
        if (texElement) {
            fbo.texture(texElement);
        }
        fbo.circle(this.pos.x, this.pos.y, 250)
        this.portalPos = fbo.treeLocation(/*[0, 0, 0],*/ { from: Tree.MODEL, to: Tree.WORLD });
        fbo.pop()
    }
}
function scene(fbo, centerObject, frontWall, backWall) {
    fbo.background(120);
    fbo.reset();
    fbo.rectMode(CENTER);
    fbo.ambientLight(255);
    fbo.noStroke();
    fbo.push()
    fbo.rotateZ(angle)
    fbo.rotateX(angle)
    fbo.rotateY(angle)
    if (centerObject) {
        fbo.texture(kemonaSilver)
        fbo.box(100)
    } else {
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
    if (backWall) {
        // Trasera Z-
        fbo.push();
        fbo.stroke(2);
        fbo.ambientLight(255);
        fbo.ambientMaterial(100);
        fbo.translate(0, -25, -450);
        fbo.box(900, 250, 20);
        fbo.pop();
    }
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