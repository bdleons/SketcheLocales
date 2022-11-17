let myShader;
let c1, c2;

function preload() {
    myShader = readShader('shaders/blend.frag',
        { matrices: Tree.NONE, varyings: Tree.NONE });
}

function setup() {
    // shaders require WEBGL mode to work
    createCanvas(900, 900, WEBGL);
    colorMode(RGB, 1);
    noStroke();
    c1 = createColorPicker(color(0.8, 0.5, 0.3));
    c1.position(10, 10);
    c2 = createColorPicker(color(0.9, 0.1, 0.4));
    c2.position(width / 2 + 10, 10);
    // https://p5js.org/reference/#/p5/shader
    shader(myShader);
}
function draw() {
    background(0);
    fill("blue");
    myShader.setUniform('uMaterial1', [red(c1.color()), green(c1.color()), blue(c1.color()), 1.0]);
    myShader.setUniform('uMaterial2', [red(c2.color()), green(c2.color()), blue(c2.color()), 1.0]);
    rect(0.0,0.0,0.2,0.2);
}