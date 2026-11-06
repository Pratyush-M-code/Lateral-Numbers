// init
let el = document.getElementById("canvas")
let zoom = 0.5
let unit = (el.clientWidth / 10) * zoom
function updateUnit() { unit = (el.clientWidth / 10) * zoom }
function fit(p, id) {
    const box = document.getElementById(id)
    p.resizeCanvas(box.clientWidth, box.clientHeight)
}

// Paper edges
function roughEdges(el, spacing = 28, jitter = 3) {
    const nx = Math.max(4, Math.round(el.offsetWidth / spacing));
    const ny = Math.max(2, Math.round(el.offsetHeight / spacing));
    const j = () => (Math.random() * jitter).toFixed(1) + "px";
    const pct = (v) => (v * 100).toFixed(2) + "%";
    const points = [];

    for (let i = 0; i < nx; i++) points.push(`${pct(i / nx)} ${j()}`);                          // top
    for (let i = 0; i < ny; i++) points.push(`calc(100% - ${j()}) ${pct(i / ny)}`);             // right
    for (let i = 0; i < nx; i++) points.push(`${pct(1 - i / nx)} calc(100% - ${j()})`);         // bottom
    for (let i = 0; i < ny; i++) points.push(`${j()} ${pct(1 - i / ny)}`);                      // left

    el.style.clipPath = `polygon(${points.join(", ")})`;
}

window.addEventListener("load", () => {
    document.querySelectorAll(".content").forEach((el) => {
        if (el.id !== "canvas") roughEdges(el);
    });
});

// Addition
document.getElementById("a-addition").value = 4
document.getElementById("b-addition").value = 2
document.getElementById("c-addition").value = -6
document.getElementById("d-addition").value = -1

function addition(p) {
    let motion, memory, motionIndex, progress
    let animationSpeed = 0.01;

    function reset() {

        const a_addition = Number(document.getElementById("a-addition").value) || 0;
        const b_addition = Number(document.getElementById("b-addition").value) || 0;
        const c_addition = Number(document.getElementById("c-addition").value) || 0;
        const d_addition = Number(document.getElementById("d-addition").value) || 0;

        const v1 = new makeVector(a_addition, b_addition, "Vector 1")
        const v1_real = new makeVector(a_addition, 0, "Real Coff. 1")
        const v1_img = new makeVector(0, b_addition, "Img Coff. 1")
        const v2 = new makeVector(c_addition, d_addition, "Vector 2")
        const v2_real = new makeVector(c_addition, 0, "Real Coff. 2")
        const v2_img = new makeVector(0, d_addition, "Img Coff. 2")

        document.getElementById("additon-readout").value = `${a_addition + c_addition} + ${b_addition + d_addition}i`

        motion = [
            { op: 'render', p: v1_real, q: 0 },
            { op: 'render', p: v1_img, q: 0 },
            { op: 'make', p: v1, q: 0 },
            { op: 'render', p: v2_real, q: 0 },
            { op: 'render', p: v2_img, q: 0 },
            { op: 'make', p: v2, q: 0 },
            { op: 'join', p: v1_real, q: v2_real },
            { op: '+', p: v1_real, q: v2_real, label: "Real Coff Resultant" },
            { op: 'join', p: v1_img, q: v2_img },
            { op: '+', p: v1_img, q: v2_img, label: "Img Coff. Resultant" },
            { op: 'join', p: v1, q: v2 },
            { op: '+', p: v1, q: v2, label: "Resultant" },
        ];
        memory = []
        motionIndex = 0
        progress = 0
    }
    reset()
    p.reset = reset

    function nextStep() {
        if (motionIndex >= motion.length) return;
        renderStep(p, motion[motionIndex], 1, memory);
        motionIndex++;
        progress = 0;
    }
    p.nextStep = nextStep

    function backStep() {
        if (motionIndex <= 0) return;

        motionIndex--;
        progress = 0;

        rebuildMemory(p, motion, motionIndex, memory);
    }
    p.backStep = backStep

    p.setup = function () {
        const box = document.getElementById("addition-canvas")
        p.createCanvas(box.clientWidth, box.clientHeight).parent(box)
    }
    p.windowResized = function () { fit(p, "addition-canvas") }
    p.draw = function () {
        p.background("#E5CBBA");
        renderGraph(p, graph_colour, 3)

        if (motionIndex < motion.length) {
            let step = motion[motionIndex];

            progress += animationSpeed;
            if (progress >= 1) {
                progress = 1;
            }

            renderStep(p, step, progress, memory);
            renderMemory(p, memory);

            if (progress >= 1) {
                motionIndex++; progress = 0;
            }
        }
        if (motionIndex >= motion.length) {
            renderMemory(p, memory);
        }
    }
}
let additionSim = new p5(addition)
function resetAddition() { additionSim.reset() }
function nextAddition() { additionSim.nextStep() }
function backAddition() { additionSim.backStep() }

//Subtraction
document.getElementById("a-subtraction").value = 3
document.getElementById("b-subtraction").value = 2
document.getElementById("c-subtraction").value = -2
document.getElementById("d-subtraction").value = 1
function subtraction(p) {
    let motion, memory, motionIndex, progress
    let animationSpeed = 0.01;

    function reset() {

        const a_subtraction = Number(document.getElementById("a-subtraction").value) || 0;
        const b_subtraction = Number(document.getElementById("b-subtraction").value) || 0;
        const c_subtraction = Number(document.getElementById("c-subtraction").value) || 0;
        const d_subtraction = Number(document.getElementById("d-subtraction").value) || 0;

        const v1 = new makeVector(a_subtraction, b_subtraction, "Vector 1")
        const v1_real = new makeVector(a_subtraction, 0, "Real Coff. 1")
        const v1_img = new makeVector(0, b_subtraction, "Img Coff. 1")
        const v2 = new makeVector(c_subtraction, d_subtraction, "Vector 2")
        const v2_real = new makeVector(c_subtraction, 0, "Real Coff. 2")
        const v2_img = new makeVector(0, d_subtraction, "Img Coff. 2")


        document.getElementById("subtraction-readout").value = `${a_subtraction - c_subtraction} + ${b_subtraction - d_subtraction}i`

        motion = [
            { op: 'render', p: v1_real, q: 0 },
            { op: 'render', p: v1_img, q: 0 },
            { op: 'make', p: v1, q: 0 },
            { op: 'render', p: v2_real, q: 0 },
            { op: 'render', p: v2_img, q: 0 },
            { op: 'make', p: v2, q: 0 },
            { op: 'join', p: v1_real, q: v2_real },
            { op: '-', p: v2_real, q: 0 },
            { op: '+', p: v1_real, q: v2_real, label: "Real Coff Resultant" },
            { op: 'join', p: v1_img, q: v2_img },
            { op: '-', p: v2_img, q: 0 },
            { op: '+', p: v1_img, q: v2_img, label: "Img Coff. Resultant" },
            { op: 'join', p: v1, q: v2 },
            { op: '-', p: v2, q: 0 },
            { op: '+', p: v1, q: v2, label: "Resultant" },
        ];
        memory = []
        motionIndex = 0
        progress = 0
    }
    reset()
    p.reset = reset

    function nextStep() {
        if (motionIndex >= motion.length) return;
        renderStep(p, motion[motionIndex], 1, memory);
        motionIndex++;
        progress = 0;
    }
    p.nextStep = nextStep

    function backStep() {
        if (motionIndex <= 0) return;

        motionIndex--;
        progress = 0;

        rebuildMemory(p, motion, motionIndex, memory);
    }
    p.backStep = backStep

    p.setup = function () {
        const box = document.getElementById("subtraction-canvas")
        p.createCanvas(box.clientWidth, box.clientHeight).parent(box)
    }
    p.windowResized = function () { fit(p, "subtraction-canvas") }
    p.draw = function () {
        p.background("#E5CBBA");
        renderGraph(p, graph_colour, 3)

        if (motionIndex < motion.length) {
            let step = motion[motionIndex];

            progress += animationSpeed;
            if (progress >= 1) {
                progress = 1;
            }

            renderStep(p, step, progress, memory);
            renderMemory(p, memory);

            if (progress >= 1) {
                motionIndex++; progress = 0;
            }
        }
        if (motionIndex >= motion.length) {
            renderMemory(p, memory);
        }
    }
}
let subtractionSim = new p5(subtraction)
function resetSubtraction() { subtractionSim.reset() }
function nextSubtraction() { subtractionSim.nextStep() }
function backSubtraction() { subtractionSim.backStep() }

//Euler's formula
document.getElementById("a-euler").value = 3
document.getElementById("b-euler").value = 2
function eulerForm(p) {
    let motion, memory, motionIndex, progress
    let animationSpeed = 0.01;

    function reset() {

        const a_euler = Number(document.getElementById("a-euler").value) || 0;
        const b_euler = Number(document.getElementById("b-euler").value) || 0;

        const v1 = new makeVector(a_euler, b_euler, "Vector")
        const v2 = new makeVector(v1.magnitude, 0, "Radius")

        document.getElementById("euler-readout").value = `${v1.magnitude.toFixed(2)}e ^ (i * ${v1.argument.toFixed(2)}rad)`
        motion = [
            { op: 'make', p: v1, q: 0 },
            { op: 'circle', p: v1, q: 0 },
            { op: 'rotate', p: v2, q: v1.argument }
        ];

        memory = []
        motionIndex = 0
        progress = 0
    }
    reset()
    p.reset = reset

    function nextStep() {
        if (motionIndex >= motion.length) return;
        renderStep(p, motion[motionIndex], 1, memory);
        motionIndex++;
        progress = 0;
    }
    p.nextStep = nextStep

    function backStep() {
        if (motionIndex <= 0) return;

        motionIndex--;
        progress = 0;

        rebuildMemory(p, motion, motionIndex, memory);
    }
    p.backStep = backStep

    p.setup = function () {
        const box = document.getElementById("euler-canvas")
        p.createCanvas(box.clientWidth, box.clientHeight).parent(box)
    }
    p.windowResized = function () { fit(p, "euler-canvas") }
    p.draw = function () {
        p.background("#E5CBBA");
        renderGraph(p, graph_colour, 3)

        if (motionIndex < motion.length) {
            let step = motion[motionIndex];

            progress += animationSpeed;
            if (progress >= 1) {
                progress = 1;
            }

            renderStep(p, step, progress, memory);
            renderMemory(p, memory);

            if (progress >= 1) {
                motionIndex++; progress = 0;
            }
        }
        if (motionIndex >= motion.length) {
            renderMemory(p, memory);
        }
    }
}
let eulerFormSim = new p5(eulerForm)
function resetEuler() { eulerFormSim.reset() }
function nextEuler() { eulerFormSim.nextStep() }
function backEuler() { eulerFormSim.backStep() }

//Multiplication
function multiplication(p) {
    let motion, memory, motionIndex, progress
    let animationSpeed = 0.01;

    function reset() {
        const v1 = new makeVector(2, -2)
        const v2 = new makeVector(1, 3)
        motion = [
            { op: 'make', p: v1, q: 0 },
            { op: 'make', p: v2, q: 0 },
            { op: '*', p: v1, q: v2 }
        ];
        memory = []
        motionIndex = 0
        progress = 0
    }
    reset()
    p.reset = reset

    function nextStep() {
        if (motionIndex >= motion.length) return;
        renderStep(p, motion[motionIndex], 1, memory);
        motionIndex++;
        progress = 0;
    }
    p.nextStep = nextStep

    function backStep() {
        if (motionIndex <= 0) return;

        motionIndex--;
        progress = 0;

        rebuildMemory(p, motion, motionIndex, memory);
    }
    p.backStep = backStep

    p.setup = function () {
        const box = document.getElementById("multiplication-canvas")
        p.createCanvas(box.clientWidth, box.clientHeight).parent(box)
    }
    p.windowResized = function () { fit(p, "multiplication -canvas") }
    p.draw = function () {
        p.background("#E5CBBA");
        renderGraph(p, graph_colour, 3)

        if (motionIndex < motion.length) {
            let step = motion[motionIndex];

            progress += animationSpeed;
            if (progress >= 1) {
                progress = 1;
            }

            renderStep(p, step, progress, memory);
            renderMemory(p, memory);

            if (progress >= 1) {
                motionIndex++; progress = 0;
            }
        }
        if (motionIndex >= motion.length) {
            renderMemory(p, memory);
        }
    }
}
let multiplicationSim = new p5(multiplication)
function resetMultiplication() { multiplicationSim.reset() }
function nextMultiplication() { multiplicationSim.nextStep() }
function backMultiplication() { multiplicationSim.backStep() }

//Division
function division(p) {
    let motion, memory, motionIndex, progress
    let animationSpeed = 0.01;

    function reset() {
        const v1 = new makeVector(2, -2)
        const v2 = new makeVector(1, 3)
        motion = [
            { op: 'make', p: v1, q: 0 },
            { op: 'make', p: v2, q: 0 },
            { op: '/', p: v1, q: v2 }
        ];
        memory = []
        motionIndex = 0
        progress = 0
    }
    reset()
    p.reset = reset

    function nextStep() {
        if (motionIndex >= motion.length) return;
        renderStep(p, motion[motionIndex], 1, memory);
        motionIndex++;
        progress = 0;
    }
    p.nextStep = nextStep

    function backStep() {
        if (motionIndex <= 0) return;

        motionIndex--;
        progress = 0;

        rebuildMemory(p, motion, motionIndex, memory);
    }
    p.backStep = backStep

    p.setup = function () {
        const box = document.getElementById("division-canvas")
        p.createCanvas(box.clientWidth, box.clientHeight).parent(box)
    }
    p.windowResized = function () { fit(p, "division -canvas") }
    p.draw = function () {
        p.background("#E5CBBA");
        renderGraph(p, graph_colour, 3)

        if (motionIndex < motion.length) {
            let step = motion[motionIndex];

            progress += animationSpeed;
            if (progress >= 1) {
                progress = 1;
            }

            renderStep(p, step, progress, memory);
            renderMemory(p, memory);

            if (progress >= 1) {
                motionIndex++; progress = 0;
            }
        }
        if (motionIndex >= motion.length) {
            renderMemory(p, memory);
        }
    }
}
let divisionSim = new p5(division)
function resetDivision() { divisionSim.reset() }
function nextDivision() { divisionSim.nextStep() }
function backDivision() { divisionSim.backStep() }

// Zoom Handler
let zoom_readout = document.getElementById("zoom_readout")
function zoom_in() {
    zoom = zoom * 2
    updateUnit()
    zoom_readout.textContent = zoom
    loadEquation()
}
function zoom_out() {
    zoom = zoom / 2
    updateUnit()
    zoom_readout.textContent = zoom
    loadEquation()
}

// Text Parser
let typeBox = document.getElementById("equation")
let text = typeBox.value
typeBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        loadEquation()
    }
});
const valid_operators = ['+', '-', '*', '/']
function parseText(text) {
    let steps = [];
    let arr = text.split('')

    //remove spaces
    let normalized_arr = []
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === " ") {
        }
        else {
            normalized_arr.push(arr[i])
        }
    }

    //decision tree
    let bracket_loop = false;

    // Number reader for negatives and decimals
    function readNumber(i, array) {
        let number = ""
        if (array[i] === "-" || array[i] === '+') {
            number = number + String(array[i])
            i++
        }

        digits = /[0-9.]/
        while (i < array.length && (digits.test(array[i]))) {
            number = number + String(array[i])
            i++
        }

        return {
            value: Number(number),
            index: i
        }
    }
    function textToVector(i, array) {
        if (array[i] !== '(') {
            throw new Error("opening bracket missing" + i)
        }
        else {
            i++
        }

        let real = readNumber(i, array)
        i = real.index
        let imaginary = readNumber(i, array)
        i = imaginary.index

        if (array[i] !== 'i') {
            throw new Error("missing i");
        }
        else {
            i++;
        }

        if (array[i] !== ')') {
            throw new Error("missing )");
        }
        else {
            i++;
        }

        return {
            value: new makeVector(real.value, imaginary.value),
            index: i
        }
    }

    //to do
    let first = textToVector(0, normalized_arr)
    let operator = normalized_arr[first.index];

    if (!valid_operators.includes(operator)) {
        throw new Error("Invalid operator")
    }

    let second = textToVector(first.index + 1, normalized_arr);

    steps = []
    steps.push({ op: 'make', p: first.value, q: 0 });
    steps.push({ op: 'make', p: second.value, q: 0 });
    if (operator === '+') {
        steps.push({ op: 'join', p: first.value, q: second.value });
        steps.push({ op: '+', p: first.value, q: second.value });
    }
    else if (operator === '-') {
        steps.push({ op: 'join', p: first.value, q: second.value });
        steps.push({ op: '-', p: second.value });
        steps.push({ op: '+', p: first.value, q: second.value });
    }
    else if (operator === '*') {
        steps.push({ op: '*', p: first.value, q: second.value });
    }
    else if (operator === '/') {
        if (second.value.magnitude === 0) throw new Error("Division by zero");
        steps.push({ op: '/', p: first.value, q: second.value });
    }
    return steps;
}

//animate
function sandbox(p) {
    let steps = [];
    let stepIndex = 0;
    let progress = 0;
    let memory = [
        // { vector: , colour: }
    ]
    let animationSpeed = 0.01;

    p.load = function (newSteps) {
        steps = newSteps; stepIndex = 0; progress = 0; memory = [];
    }
    p.setup = function () {
        const box = document.getElementById("canvas")
        p.createCanvas(box.clientWidth, box.clientHeight).parent(box)
    }
    p.windowResized = function () { updateUnit(); fit(p, "canvas") }
    p.draw = function () {
        p.background("#E5CBBA");
        renderGraph(p, graph_colour, 3)

        if (stepIndex < steps.length) {
            let step = steps[stepIndex];
            progress = Math.min(1, progress + animationSpeed);

            renderStep(p, step, progress, memory)
            renderMemory(p, memory);

            if (progress >= 1) {
                stepIndex++; progress = 0;
            }
        } else {
            renderMemory(p, memory);
        }
    }
}

let sandboxSim = new p5(sandbox)