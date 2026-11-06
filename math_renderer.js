// Colours
let compontent_colour = "#C0392B"
let actionable_colour = "#2A4D9B"
let resultant_colour = "#76528B"
let graph_colour = "#347A68"
let actionable_graph_colour = "#A66B35"

// To make vectors in the format (a + ib)
function makeVector(a = 0, b = 0, label = "") {
    this.real_coff = a;
    this.img_coff = b;
    this.magnitude = Math.pow(Math.pow(a, 2) + Math.pow(b, 2), 0.5)
    this.argument = Math.atan2(b, a)
    this.update = function () {
        this.magnitude = Math.pow(Math.pow(this.real_coff, 2) + Math.pow(this.img_coff, 2), 0.5)
        this.argument = Math.atan2(this.img_coff, this.real_coff)
    }
    this.origin_x = 0
    this.origin_y = 0
    this.end_x = function () { return this.origin_x + this.real_coff }
    this.end_y = function () { return this.origin_y + this.img_coff }
    this.real_vec = function () { return new makeVector(this.real_coff, 0) }
    this.img_vec = function () { return new makeVector(0, this.img_coff) }
    this.print_output = function () {
        return this.real_coff + " + " + this.img_coff + "i";
    }
    this.label = label
}

//To render grid
function renderGraph(p, colour = graph_colour, weight = "3", progress = null, unit_vector = null) {
    p.push()
    p.translate(p.width / 2, p.height / 2);
    let origin = Math.hypot(p.width, p.height) / 2

    if (progress === null) {
        const hw = p.width / 2
        const hh = p.height / 2
        p.noStroke()
        p.fill(colour)
        p.textSize(16)
        p.textAlign(p.CENTER, p.CENTER)
        p.text("0", 12, 12)
        p.text("x", hw - 12, 14)
        p.text("-x", -hw + 16, 14)
        p.text("i", 14, -hh + 12)
        p.text("-i", 14, hh - 12)

        p.stroke(colour)
        p.strokeWeight(weight)
        p.line(-origin, 0, origin, 0) //x axis
        p.line(0, -origin, 0, origin) //y axis


        p.strokeWeight(Math.ceil(weight / 3))
        let n_lines = Math.ceil((p.width * Math.SQRT2) / (unit));
        for (let i = 1; i <= n_lines; i++) {
            // Horizontal grid lines
            p.line(-origin, i * unit, origin, i * unit);
            p.line(-origin, -i * unit, origin, -i * unit);
            // Vertical grid lines
            p.line(i * unit, -origin, i * unit, origin);
            p.line(-i * unit, -origin, -i * unit, origin);
        }
    }
    else {
        p.rotate(-unit_vector.argument * progress)
        let scaledUnit = unit * (1 + (unit_vector.magnitude - 1) * progress);
        p.stroke(colour)
        p.strokeWeight(weight)
        p.line(-origin, 0, origin, 0) //x axis
        p.line(0, -origin, 0, origin) //y axis

        p.strokeWeight(Math.ceil(weight / 3))
        let n_lines = Math.ceil((p.width * Math.SQRT2) / (scaledUnit));
        for (let i = 1; i <= n_lines; i++) {
            // Horizontal grid lines
            p.line(-origin, i * scaledUnit, origin, i * scaledUnit);
            p.line(-origin, -i * scaledUnit, origin, -i * scaledUnit);
            // Vertical grid lines
            p.line(i * scaledUnit, -origin, i * scaledUnit, origin);
            p.line(-i * scaledUnit, -origin, -i * scaledUnit, origin);
        }
    }

    p.pop();
}

// Render Vector
function renderVector(p, colour, vector, progress) {
    p.push();
    p.translate(p.width / 2, p.height / 2);

    p.stroke(colour);
    p.strokeWeight(5);
    p.fill(colour);

    const end_x = vector.origin_x + vector.real_coff * progress;
    const end_y = vector.origin_y + vector.img_coff * progress;
    const dx = end_x - vector.origin_x;
    const dy = end_y - vector.origin_y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2)

    if (distance > 0) {
        const cos_theta = dx / distance;
        const sine_theta = dy / distance;
        const head = Math.min(0.3, distance / 2)
        const arrow_x = end_x - (dx / distance) * head
        const arrow_y = end_y - (dy / distance) * head
        const r = head / 2.5

        const arrow_x1 = arrow_x - r * sine_theta;
        const arrow_x2 = arrow_x + r * sine_theta;
        const arrow_y1 = arrow_y + r * cos_theta;
        const arrow_y2 = arrow_y - r * cos_theta;

        p.triangle(
            end_x * unit, -end_y * unit,
            arrow_x1 * unit, -arrow_y1 * unit,
            arrow_x2 * unit, -arrow_y2 * unit
        );
    }
    p.line(
        vector.origin_x * unit, -vector.origin_y * unit,
        end_x * unit, -end_y * unit
    );

    if (vector.label != "") {
        renderInlineVectorLabeles(p, vector.label, colour, vector, progress)
    }

    p.pop();
}
function renderInlineVectorLabeles(p, text, colour, vector, progress) {
    p.push();

    const mx = vector.origin_x + (vector.real_coff * progress) / 2
    const my = vector.origin_y + (vector.img_coff * progress) / 2
    p.translate(mx * unit, -my * unit)

    let angle = -vector.argument
    const flipped = Math.abs(vector.argument) > Math.PI / 2
    if (flipped) angle += Math.PI
    p.rotate(angle)

    p.noStroke();
    p.fill(colour);
    p.textSize(16);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(text, 0, flipped ? 16 : -16)

    p.pop();
}

// Translate Vector
function translateVector(p, colour, vector, progress, end_vector) {
    p.push();
    p.translate(p.width / 2, p.height / 2);

    p.stroke(colour);
    p.strokeWeight(5);
    p.fill(colour);

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

        p.triangle(
            tip_x * unit, -tip_y * unit,
            arrow_x1 * unit, -arrow_y1 * unit,
            arrow_x2 * unit, -arrow_y2 * unit
        );
    }
    p.line(
        origin_x * unit, -origin_y * unit,
        tip_x * unit, -tip_y * unit
    );
    if (progress >= 1) {
        vector.origin_x = end_x;
        vector.origin_y = end_y;
    }
    p.pop();
}

// Reders a circle
function renderCircle(p, colour, vector, progress) {
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.stroke(colour);
    p.strokeWeight(2);
    p.noFill();

    const radius = vector.magnitude * progress;
    p.ellipse(vector.origin_x * unit, -vector.origin_y * unit, radius * unit * 2, radius * unit * 2)
    p.pop();
}

// Renders a label
function renderVectorLabel(p, text, colour, vector, progress) {
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.rotate(vector.argument);
    p.noStroke();
    p.fill(colour);
    p.textSize(16);
    p.textAlign(p.CENTER, p.CENTER);

    let mx = (vector.real_coff * progress) / 2
    let my = (vector.img_coff * progress) / 2

    p.text(text, mx * unit, my * unit - 16)
    p.pop();
}

function renderMemory(p, memory) {
    for (let i = 0; i < memory.length; i++) {
        let current = memory[i]
        renderVector(p, current['colour'], current['vector'], 1)
    }
}
function clearFromMemory(step, memory) {
    for (let i = memory.length - 1; i >= 0; i--) {
        if (memory[i].vector === step.p || memory[i].vector === step.q) memory.splice(i, 1);
    }
}


function renderStep(p, step, e, memory) {
    clearFromMemory(step, memory)

    if (step.op === 'make') {

        // render real and imaginary components
        renderVector(p, compontent_colour, step.p.real_vec(), 1)
        renderVector(p, compontent_colour, step.p.img_vec(), 1)
        //render resultant vector
        renderVector(p, resultant_colour, step.p, e)

        if (e >= 1) {
            memory.push({ colour: resultant_colour, vector: step.p })
        }
    }

    if (step.op === 'join') {

        // render initial vector
        renderVector(p, resultant_colour, step.p, 1)
        // render vector to be joined
        translateVector(p, actionable_colour, step.q, e, step.p)

        if (e >= 1) {
            step.q.origin_x = step.p.end_x();
            step.q.origin_y = step.p.end_y();
            memory.push({ colour: resultant_colour, vector: step.p })
        }
    }

    if (step.op === 'rotate') {

        // roatated vector
        let rotated_vector = new makeVector(
            step.p.magnitude * Math.cos(step.q * e),
            step.p.magnitude * Math.sin(step.q * e)
        )
        renderVector(p, actionable_colour, rotated_vector, 1)

        if (e >= 1) {
            step.p.real_coff = step.p.magnitude * Math.cos(step.q * e)
            step.p.img_coff = step.p.magnitude * Math.sin(step.q * e)
            memory.push({ colour: resultant_colour, vector: step.p })
        }
    }
    if (step.op === '+') {

        // render both vectors
        renderVector(p, compontent_colour, step.p, 1)
        renderVector(p, compontent_colour, step.q, 1)
        // renders sum vectors
        let sum = new makeVector(step.p.real_coff + step.q.real_coff, step.p.img_coff + step.q.img_coff)
        renderVector(p, resultant_colour, sum, e)

        if (e >= 1) {
            memory.push({ colour: resultant_colour, vector: sum })
        }
    }
    if (step.op === '-') {

        // changing initial vector to negative
        let scale = 1 - 2 * e;
        let flipped = new makeVector(step.p.real_coff * scale, step.p.img_coff * scale);
        flipped.origin_x = step.p.origin_x;
        flipped.origin_y = step.p.origin_y;
        // rendering flipped vector
        renderVector(p, actionable_colour, flipped, 1)

        if (e >= 1) {
            step.p.real_coff = -step.p.real_coff;
            step.p.img_coff = -step.p.img_coff;
            memory.push({ colour: actionable_colour, vector: step.p })
        }
    }
    if (step.op === '*') {

        // establishing unit vector for graph rotation
        let unit_vector = new makeVector(step.p.real_coff, step.p.img_coff)
        let instant_argument = step.p.argument * e;
        let instant_magnitude = 1 + (step.p.magnitude - 1) * e;

        // rendering graph rotation and scaling
        renderGraph(p, actionable_graph_colour, 2, e, unit_vector)
        renderVector(p, compontent_colour, step.p, 1)
        renderVector(p, compontent_colour, step.q, 1)

        // rendering moving vector
        let moving_unit = new makeVector(
            instant_magnitude * Math.cos(instant_argument),
            instant_magnitude * Math.sin(instant_argument)
        );
        renderVector(p, actionable_colour, moving_unit, 1)

        // rendering resultant vector
        let current = new makeVector(
            step.q.magnitude * instant_magnitude * Math.cos(step.q.argument + instant_argument),
            step.q.magnitude * instant_magnitude * Math.sin(step.q.argument + instant_argument)
        );
        renderVector(p, resultant_colour, current, 1)

        if (e >= 1) {
            let product = new makeVector(
                step.p.real_coff * step.q.real_coff - step.p.img_coff * step.q.img_coff,
                step.p.real_coff * step.q.img_coff + step.p.img_coff * step.q.real_coff
            );
            memory.push({ colour: resultant_colour, vector: product })
        }
    }
    if (step.op === '/') {

        // establishing unit vector for graph rotation
        let divsior_magnitude = step.q.magnitude ** 2
        let inverse = new makeVector(step.q.real_coff / divsior_magnitude, -step.q.img_coff / divsior_magnitude)
        let instant_argument = inverse.argument * e;
        let instant_magnitude = 1 + (inverse.magnitude - 1) * e;

        // rendering graph rotation and scaling
        renderGraph(p, actionable_graph_colour, 2, e, inverse)
        renderVector(p, compontent_colour, step.p, 1)
        renderVector(p, compontent_colour, step.q, 1)

        let divisor_now = new makeVector(
            step.q.magnitude * instant_magnitude * Math.cos(step.q.argument + instant_argument),
            step.q.magnitude * instant_magnitude * Math.sin(step.q.argument + instant_argument)
        )
        renderVector(p, actionable_colour, divisor_now, 1)

        let current = new makeVector(
            step.p.magnitude * instant_magnitude * Math.cos(step.p.argument + instant_argument),
            step.p.magnitude * instant_magnitude * Math.sin(step.p.argument + instant_argument)
        )
        renderVector(p, resultant_colour, current, 1)

        if (e >= 1) {
            let quotient = new makeVector(
                (step.p.real_coff * step.q.real_coff + step.p.img_coff * step.q.img_coff) / divsior_magnitude,
                (step.p.img_coff * step.q.real_coff - step.p.real_coff * step.q.img_coff) / divsior_magnitude
            )
            memory.push({ colour: resultant_colour, vector: quotient })
        }
    }
    if (step.op === '^') {

    }
    if (step.op === 'circle') {
        //circle unit vector
        let circle_unit = new makeVector(step.p.magnitude, 0, "Radius");

        renderVector(p, compontent_colour, step.p, 1)
        renderVector(p, actionable_colour, circle_unit, e)
        renderCircle(p, actionable_colour, step.p, e)

        if (e >= 1) {
            memory.push({ colour: compontent_colour, vector: step.p })
        }
    }
}
function rebuildMemory(p, motion, motionIndex, memory) {
    const vectors = new Set();

    for (const step of motion) {
        if (step.p && typeof step.p === "object") {
            vectors.add(step.p);
        }

        if (step.q && typeof step.q === "object") {
            vectors.add(step.q);
        }
    }

    for (const vector of vectors) {
        vector.origin_x = 0;
        vector.origin_y = 0;
    }

    memory.length = 0;

    for (let i = 0; i < motionIndex; i++) {
        renderStep(p, motion[i], 1, memory);
    }
}

function loadEquation() {
    let text = document.getElementById("equation").value;
    try {
        sandboxSim.load(parseText(text));
    } catch (error) {
        sandboxSim.load([]);
        console.error(error.message);
    }
}   
