// init
let el = document.getElementById("canvas")
side = el.clientWidth
let zoom = 0.5
let unit = (side / 10) * zoom

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

// Zoom Handler
let zoom_readout = document.getElementById("zoom_readout")
function zoom_in() {
    zoom = zoom * 2
    unit = (side / 10) * zoom
    zoom_readout.textContent = zoom
    loadEquation()
}
function zoom_out() {
    zoom = zoom / 2
    unit = (side / 10) * zoom
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
let steps = [];
let stepIndex = 0;
let progress = 0;
function sandbox(p) {
    let animationSpeed = 0.01;
    p.setup = function () {
        p.createCanvas(side, side).parent("canvas")
    }
    p.draw = function () {
        p.background("#E5CBBA");
        renderGraph(p, graph_colour, 3)

        if (stepIndex < steps.length) {
            let step = steps[stepIndex];

            progress += animationSpeed;
            if (progress >= 1) {
                progress = 1;
            }

            renderStep(p, step, progress);
            renderMemory(p, memory);

            if (progress >= 1) {
                stepIndex++;
                progress = 0;
            }
        }

        if (stepIndex >= steps.length) {
            renderMemory(p, memory);
        }
    }
}

new p5(sandbox)