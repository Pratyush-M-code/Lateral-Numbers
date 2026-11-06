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
function addition(p) {
    let motion, memory, motionIndex, progress
    let animationSpeed = 0.01;

    function reset() {
        const v1 = new makeVector(3, 2)
        const v2 = new makeVector(-1, -4)
        motion = [
            { op: 'make', p: v1, q: 0 },
            { op: 'make', p: v2, q: 0 },
            { op: 'join', p: v1, q: v2 },
            { op: '+', p: v1, q: v2 }
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
function subtraction(p) {
    let motion, memory, motionIndex, progress
    let animationSpeed = 0.01;

    function reset() {
        const v1 = new makeVector(3, -1)
        const v2 = new makeVector(-5, -2)
        motion = [
            { op: 'make', p: v1, q: 0 },
            { op: 'make', p: v2, q: 0 },
            { op: 'join', p: v1, q: v2 },
            { op: '-', p: v2, q: 0 },
            { op: '+', p: v1, q: v2 }
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