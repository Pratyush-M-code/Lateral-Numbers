// init
let el = document.getElementById("canvas")
side = el.clientWidth
let zoom = 1
let unit = (side / 10) * zoom
function setup() {
    createCanvas(side, side).parent("canvas")
}

// Colours
let compontent_colour = "#C0392B"
let actionable_colour = "#2A4D9B"
let resultant_colour = "#347A68"

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
function renderGraph(colour = "green", weight = "3", progress = null, unit_vector = null) {
    push()
    translate(side / 2, side / 2)
    let origin = side / 2 * Math.SQRT2

    if (progress === null) {
        stroke(colour)
        strokeWeight(weight)
        line(-origin, 0, origin, 0) //x axis
        line(0, -origin, 0, origin) //y axis

        strokeWeight(Math.ceil(weight / 3))
        let n_lines = Math.ceil((side * Math.SQRT2) / (unit));
        for (let i = 1; i <= n_lines; i++) {
            // Horizontal grid lines
            line(-origin, i * unit, origin, i * unit);
            line(-origin, -i * unit, origin, -i * unit);
            // Vertical grid lines
            line(i * unit, -origin, i * unit, origin);
            line(-i * unit, -origin, -i * unit, origin);
        }
    }
    else {
        rotate(-unit_vector.argument * progress)
        let scaledUnit = unit * (1 + (unit_vector.magnitude - 1) * progress);
        stroke(colour)
        strokeWeight(weight)
        line(-origin, 0, origin, 0) //x axis
        line(0, -origin, 0, origin) //y axis

        strokeWeight(Math.ceil(weight / 3))
        let n_lines = Math.ceil((side * Math.SQRT2) / (scaledUnit));
        for (let i = 1; i <= n_lines; i++) {
            // Horizontal grid lines
            line(-origin, i * scaledUnit, origin, i * scaledUnit);
            line(-origin, -i * scaledUnit, origin, -i * scaledUnit);
            // Vertical grid lines
            line(i * scaledUnit, -origin, i * scaledUnit, origin);
            line(-i * scaledUnit, -origin, -i * scaledUnit, origin);
        }
    }

    pop();
}

// Render Vector
function renderVector(colour, vector, progress) {
    push();
    translate(side / 2, side / 2);

    stroke(colour);
    strokeWeight(5);
    fill(colour);

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
function translateVector(colour, vector, progress, end_vector) {
    push();
    translate(side / 2, side / 2);

    stroke(colour);
    strokeWeight(5);
    fill(colour);

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

v1 = new makeVector(1, 2)
v2 = new makeVector(-3, -1)

//animate
let steps = [
    // { op: 'make', p: v1, q: 0 },
    // { op: 'make', p: v2, q: 0 },
    // { op: 'join', p: v1, q: v2 },
    // { op: '-', p: v2, q: 0 },
    // { op: '+', p: v1, q: v2 },

    { op: '*', p: v1, q: v2 }
    // more steps pushed here later
];
let memory = [
    // { vector: , colour: }
]
let stepIndex = 0;
let progress = 0;
let animationSpeed = 0.01;
function draw() {
    background("#E5CBBA");
    renderGraph("green", 3)

    if (stepIndex < steps.length) {
        let step = steps[stepIndex];

        progress += animationSpeed;
        if (progress >= 1) {
            progress = 1;
        }

        renderStep(step, progress);
        renderMemory(memory);

        if (progress >= 1) {
            stepIndex++;
            progress = 0;
        }
    }

    if (stepIndex >= steps.length) {
        renderMemory(memory);
    }
}

function renderMemory(memory) {
    for (let i = 0; i < memory.length; i++) {
        current = memory[i]
        renderVector(current['colour'], current['vector'], 1)
    }
}
function clearFromMemory(step) {
    memory = memory.filter(entry => entry.vector !== step.p && entry.vector !== step.q);
}


function renderStep(step, e) {
    if (step.op === 'make') {
        clearFromMemory(step)
        renderVector(compontent_colour, step.p.real_vec(), 1)
        renderVector(compontent_colour, step.p.img_vec(), 1)
        renderVector(resultant_colour, step.p, e)
        if (e >= 1) {
            memory.push({ colour: resultant_colour, vector: step.p })
        }
    }
    if (step.op === 'join') {
        clearFromMemory(step)
        renderVector(resultant_colour, step.p, 1)
        translateVector(actionable_colour, step.q, e, step.p)
        if (e >= 1) {
            step.q.origin_x = step.p.end_x();
            step.q.origin_y = step.p.end_y();
        }
        if (e >= 1) {
            memory.push({ colour: resultant_colour, vector: step.p })
        }
    }
    if (step.op === '+') {
        clearFromMemory(step)
        renderVector(compontent_colour, step.p, 1)
        renderVector(compontent_colour, step.q, 1)
        let sum = new makeVector(step.p.real_coff + step.q.real_coff, step.p.img_coff + step.q.img_coff)
        renderVector(resultant_colour, sum, e)
        if (e >= 1) memory.push({ colour: resultant_colour, vector: sum })
    }
    if (step.op === '-') {
        clearFromMemory(step)
        let scale = 1 - 2 * e;
        let flipped = new makeVector(step.p.real_coff * scale, step.p.img_coff * scale);
        flipped.origin_x = step.p.origin_x;
        flipped.origin_y = step.p.origin_y;
        renderVector(actionable_colour, flipped, 1)

        if (e >= 1) {
            step.p.real_coff = -step.p.real_coff;
            step.p.img_coff = -step.p.img_coff;
        }
    }
    if (step.op === '*') {
        clearFromMemory(step)
        let unit_vector = new makeVector(step.p.real_coff, step.p.img_coff)
        let instant_argument = step.p.argument * e;
        let instant_magnitude = 1 + (step.p.magnitude - 1) * e;

        renderGraph("black", 2, e, unit_vector)
        renderVector(compontent_colour, step.p, 1)
        renderVector(compontent_colour, step.q, 1)

        let moving_unit = new makeVector(
            instant_magnitude * Math.cos(instant_argument),
            instant_magnitude * Math.sin(instant_argument)
        );
        renderVector(actionable_colour, moving_unit, 1)

        let current = new makeVector(
            step.q.magnitude * instant_magnitude * Math.cos(step.q.argument + instant_argument),
            step.q.magnitude * instant_magnitude * Math.sin(step.q.argument + instant_argument)
        );
        renderVector(resultant_colour, current, 1)

        if (e >= 1) {
            let product = new makeVector(
                step.p.real_coff * step.q.real_coff - step.p.img_coff * step.q.img_coff,
                step.p.real_coff * step.q.img_coff + step.p.img_coff * step.q.real_coff
            );
            memory.push({ colour: resultant_colour, vector: product })
        }
    }
    if (step.op === '/') {

    }
    if (step.op === '^') {

    }
}