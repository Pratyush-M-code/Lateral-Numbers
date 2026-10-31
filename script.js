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
    this.origin_x = 0
    this.origin_y = 0
    this.end_x = function () { return this.origin_x + this.real_coff }
    this.end_y = function () { return this.origin_y + this.img_coff }
    this.real_vec = function () { return new makeVector(this.real_coff, 0) }
    this.img_vec = function () { return new makeVector(0, this.img_coff) }
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
function renderVector(vector, progress) {
    push();
    translate(side / 2, side / 2);

    stroke("red");
    strokeWeight(2);
    fill("red");

    const end_x = vector.origin_x + vector.real_coff * progress;
    const end_y = vector.origin_y + vector.img_coff * progress;
    const dx = end_x - vector.origin_x;
    const dy = end_y - vector.origin_y;
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
        vector.origin_x * unit, -vector.origin_y * unit,
        end_x * unit, -end_y * unit
    );
    pop();
}

// Translate Vector
function translateVector(vector, progress, end_vector) {
    push();
    translate(side / 2, side / 2);

    stroke("red");
    strokeWeight(2);
    fill("red");

    const start_x = vector.origin_x;
    const start_y = vector.origin_y;
    const end_x = end_vector.end_x();
    const end_y = end_vector.end_y();

    const origin_x = start_x + (end_x - start_x) * progress;
    const origin_y = start_y + (end_y - start_y) * progress;

    const tip_x = origin_x + vector.real_coff;
    const tip_y = origin_y + vector.img_coff;
    const dx = tip_x - origin_x;
    const dy = tip_y - origin_y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    if (distance > 0) {
        const cos_theta = dx / distance;
        const sine_theta = dy / distance;
        const arrow_x = tip_x - dx / 11;
        const arrow_y = tip_y - dy / 11;
        const r = distance / 25;

        const arrow_x1 = arrow_x - r * sine_theta;
        const arrow_x2 = arrow_x + r * sine_theta;
        const arrow_y1 = arrow_y + r * cos_theta;
        const arrow_y2 = arrow_y - r * cos_theta;

        triangle(
            tip_x * unit, -tip_y * unit,
            arrow_x1 * unit, -arrow_y1 * unit,
            arrow_x2 * unit, -arrow_y2 * unit
        );
    }
    line(
        origin_x * unit, -origin_y * unit,
        tip_x * unit, -tip_y * unit
    );
    if (progress >= 1) {
        vector.origin_x = end_x;
        vector.origin_y = end_y;
    }
    pop();
}

v1 = new makeVector(2, 3)
v2 = new makeVector(-1, -4)

//animate
let steps = [
    { op: 'make', p: v1, q: 0 },
    { op: 'make', p: v2, q: 0 },
    { op: 'join', p: v1, q: v2 },
    { op: '-', p: v2, q: 0 },
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
        renderVector(step.p.real_vec(), 1)
        renderVector(step.p.img_vec(), 1)
        renderVector(step.p, e)
    }
    if (step.op === 'join') {
        renderVector(step.p, 1)
        translateVector(step.q, e, step.p)
        if (e >= 1) {
            step.q.origin_x = step.p.end_x();
            step.q.origin_y = step.p.end_y();
        }
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
        let scale = 1 - 2 * e;

        let flipped = new makeVector(step.p.real_coff * scale, step.p.img_coff * scale);
        flipped.origin_x = step.p.origin_x;
        flipped.origin_y = step.p.origin_y;
        renderVector(flipped, 1)

        if (e >= 1) {
            step.p.real_coff = -step.p.real_coff;
            step.p.img_coff = -step.p.img_coff;
        }
    }
    if (step.op === '*') {

    }
    if (step.op === '/') {

    }
    if (step.op === '^') {

    }
}