let press = 0;
let relativePosCon, relativePosSubCon, relativePosRot;
let player;
let portal1 = null, portal2 = null;
let portalSpawnPosition, portalSpawnAngle;
let obstacles = [];
let portalBullet = null;

function setup() {
    createCanvas(400, 400);
    player = new Player(width / 4, height / 4);
    // portal1 = new Portal(width/2, 3*height/4, PI/2);
    // portal2 = new Portal(width/2, height/4, PI/2 - PI/30);
    //portal1.len = portal2.len = 400;
    //portal1.link(portal2);
    portalSpawnPosition = createVector(width / 2, 3 * height / 4);
    portalSpawnAngle = 0;
    obstacles.push(new Obstacle(width / 2, 0, width, PI / 2));
    obstacles.push(new Obstacle(width, height / 2, height, 0));
    obstacles.push(new Obstacle(width / 2, height, width, PI / 2));
    obstacles.push(new Obstacle(0, height / 2, height, 0));
    obstacles.push(new Obstacle(width / 2, height / 2, height, 0));
    obstacles.push(new Obstacle(width / 4, height / 2, width / 2, PI / 2));
}

function keyPressed() {
    if (key === "p") {
        player.shoot();
    }
}

function draw() {
    if (press) {
        console.log("Accediste a la informacion");
        console.log(relativePosCon);
        console.log(relativePosSubCon);
        console.log(relativePosRot);
        press = 0;
    }
    background("LightGoldenRodYellow");
    if (keyIsDown(LEFT_ARROW))
        player.turn(-1);
    if (keyIsDown(RIGHT_ARROW))
        player.turn(1);
    if (keyIsDown(UP_ARROW))
        player.move();
    // for (const obstacle of obstacles) {
    //   obstacle.check(player);
    // }
    if (portalBullet) {
        portalBullet.update();
        for (const obstacle of obstacles) {
            if (portalBullet.check(obstacle)) {
                break;
            }
        }
    }
    if (portal1) {
        portal1.check(player);
    }
    if (portalBullet) {
        portalBullet.render();
    }
    player.render();
    for (const obstacle of obstacles) {
        obstacle.render();
    }
    if (portal1) {
        portal1.render();
        portal2.render();
    }
}

class Player {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.prevPos = this.pos.copy();
        this.a = 0;
        this.r = 16;
        this.speed = 3;
        this.aspeed = PI / 90;
    }

    move() {
        this.prevPos.set(this.pos);
        const vel = p5.Vector.fromAngle(this.a);
        vel.mult(this.speed);
        this.pos.add(vel);
    }

    turn(dir) {
        this.a += dir * this.aspeed;
    }

    shoot() {
        portalBullet = new PortalBullet(this.pos.x, this.pos.y, this.a);
    }

    render() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.a);
        stroke(0);
        fill("Green");
        circle(0, 0, this.r * 2);
        line(0, 0, this.r, 0);
        pop();
    }
}

class Portal {
    constructor(x, y, a) {
        this.pos = createVector(x, y);
        this.len = 64;
        this.a = a;
        this.linkedPortal = null;
    }

    link(other) {
        this.linkedPortal = other;
        other.linkedPortal = this;
    }

    check_(player) {
        const relativePos = player.pos.copy();
        relativePosCon = relativePos
        relativePosSubCon = relativePos.sub(this.pos);
        relativePosRot = relativePos.rotate(-this.a);
        const relativePrevPos = player.prevPos.copy();
        relativePrevPos.sub(this.pos);
        relativePrevPos.rotate(-this.a);
        if ((relativePos.x < 0) !== (relativePrevPos.x < 0) && abs(relativePos.y) < this.len / 2) {
            player.pos.set(this.linkedPortal.pos);
            player.a += this.linkedPortal.a - this.a;
            return true;
        }
        return false;
    }

    check(player) {
        this.check_(player);
        // if (!this.check_(player)) {
        //   this.linkedPortal.check_(player);
        // }
    }

    render() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.a);
        stroke(0);
        fill("OrangeRed");
        rectMode(CENTER);
        rect(0, 0, 6, this.len);
        pop();
    }
}

class Obstacle {
    constructor(x, y, len, a) {
        this.pos = createVector(x, y);
        this.len = len;
        this.a = a;
    }

    check(player) {
        const relativePos = player.pos.copy();
        relativePos.sub(this.pos);
        relativePos.rotate(-this.a);
        const relativePrevPos = player.prevPos.copy();
        relativePrevPos.sub(this.pos);
        relativePrevPos.rotate(-this.a);
        if (relativePos.x <= player.r && relativePrevPos.x >= player.r && abs(relativePos.y) < this.len / 2) {
            relativePos.x = player.r;
        }
        if (relativePos.x >= -player.r && relativePrevPos.x <= -player.r && abs(relativePos.y) < this.len / 2) {
            relativePos.x = -player.r;
        }
        player.pos.set(relativePos);
        player.pos.rotate(this.a);
        player.pos.add(this.pos);
    }

    contains(x, y) {
        const pos = createVector(x, y);
        pos.sub(this.pos);
        pos.rotate(-this.a);
        return pos.x > -3 && pos.x < 3 && pos.y > -this.len / 2 && pos.y < this.len / 2;
    }

    render() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.a);
        stroke(0);
        fill("Grey");
        rectMode(CENTER);
        rect(0, 0, 6, this.len);
        pop();
    }
}

class PortalBullet {
    constructor(x, y, a) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.fromAngle(a);
        this.speed = 6;
        this.vel.mult(this.speed);
    }

    update() {
        this.pos.add(this.vel);
    }

    check(obstacle) {
        if (obstacle.contains(this.pos.x, this.pos.y)) {
            portal1 = new Portal(this.pos.x, this.pos.y, obstacle.a);
            portal2 = new Portal(portalSpawnPosition.x, portalSpawnPosition.y, portalSpawnAngle);
            portal1.link(portal2);
            portalBullet = null;
            return true;
        }
        return false;
    }

    render() {
        push();
        noStroke();
        fill(0);
        circle(this.pos.x, this.pos.y, 6);
        pop();
    }
}
function mousePressed() {
    if (press === 0) {
        press = 1;
    }
}