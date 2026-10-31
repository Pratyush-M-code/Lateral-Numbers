// init
let el = document.getElementById("canvas")
side = el.clientWidth
let zoom = 1
let unit = (side / 10) * zoom
function setup() {
    createCanvas(side, side).parent("canvas")
}

// To make vectors in the format (a + ib)
function makeVector(a = 0, b = 0) {
    this.real_coff = a;
    this.img_coff = b;
    this.magnitude = Math.pow(Math.pow(a, 2) + Math.pow(b, 2), 0.5)
    this.argument = Math.atan2(b, a)
    this.print_output = function () {
        return this.real_coff + " + " + this.img_coff + "i";
    }
}

//To render grid
function renderGraph(theta = 0, scaling = 1) {
    push()
    translate(side / 2, side / 2)
    rotate(radians(theta))
    let scaledUnit = unit * scaling;
    let origin = side / 2 * Math.SQRT2

    stroke("green")
    strokeWeight(3)
    line(-origin, 0, origin, 0) //x axis
    line(0, -origin, 0, origin) //y axis

    strokeWeight(1)
    let n_lines = Math.ceil((side * Math.SQRT2) / (scaledUnit * scaling));
    for (let i = 1; i <= n_lines; i++) {
        // Horizontal grid lines
        line(-origin, i * scaledUnit, origin, i * scaledUnit);
        line(-origin, -i * scaledUnit, origin, -i * scaledUnit);
        // Vertical grid lines
        line(i * scaledUnit, -origin, i * scaledUnit, origin);
        line(-i * scaledUnit, -origin, -i * scaledUnit, origin);
    }

    pop();
}

// Render Vector
function renderVector(vector, progress, origin_x = 0, origin_y = 0) {
    push();
    translate(side / 2, side / 2);

    stroke("red");
    strokeWeight(2);
    fill("red");

    const end_x = origin_x + vector.real_coff * progress;
    const end_y = origin_y + vector.img_coff * progress;
    const dx = end_x - origin_x;
    const dy = end_y - origin_y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2)

    if (distance > 0) {
        const cos_theta = dx / distance;
        const sine_theta = dy / distance;
        const arrow_x = end_x - dx / 11;
        const arrow_y = end_y - dy / 11;
        const r = distance / 25;

        const arrow_x1 = arrow_x - r * sine_theta;
        const arrow_x2 = arrow_x + r * sine_theta;
        const arrow_y1 = arrow_y + r * cos_theta;
        const arrow_y2 = arrow_y - r * cos_theta;

        triangle(
            end_x * unit, -end_y * unit,
            arrow_x1 * unit, -arrow_y1 * unit,
            arrow_x2 * unit, -arrow_y2 * unit
        );
    }
    line(
        origin_x * unit, -origin_y * unit,
        end_x * unit, -end_y * unit
    );
    pop();
}

v1 = new makeVector(2, 3)
v2 = new makeVector(-1, -4)

//animate
let steps = [
    { op: 'make', p: v1, q: 0 },
    { op: 'make', p: v2, q: 0 },
    { op: '+', p: v1, q: v2 },
    // more steps pushed here later
];
let stepIndex = 0;
let progress = 0;
let animationSpeed = 0.01;
function draw() {
    background("#E5CBBA");
    renderGraph(0, 1);

    if (stepIndex < steps.length) {
        let step = steps[stepIndex];

        progress += animationSpeed;
        if (progress >= 1) {
            progress = 1;
        }

        renderStep(step, progress);

        if (progress >= 1) {
            stepIndex++;
            progress = 0;
        }
    }
}

function renderStep(step, e) {
    if (step.op === 'make') {
        real_vec = new makeVector(step.p.real_coff, 0)
        img_vec = new makeVector(0, step.p.img_coff)
        renderVector(real_vec, 1);
        renderVector(img_vec, 1)
        renderVector(step.p, e)
    }
    if (step.op === 'join') {

    }
    if (step.op === '+') {
        renderVector(step.p, 1)
        renderVector(step.q, 1)
        renderVector(
            (new makeVector(
                step.p.real_coff + step.q.real_coff,
                step.p.img_coff + step.q.img_coff)),
            e
        )
    }
    if (step.op === '-') {

    }
    if (step.op === '*') {

    }
    if (step.op === '/') {

    }
    if (step.op === '^') {

    }
}